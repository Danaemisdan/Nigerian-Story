const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Replicate = require('replicate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    useFileOutput: false
});

// Middleware allows 50mb payload for base64 images/audio
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'the_nigeria_story.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Drop the old table to ensure the new schema takes effect
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                originalPortrait TEXT,
                aiPortraitUrl TEXT,
                animatedVideoUrl TEXT,
                storyType TEXT,
                storyText TEXT,
                storyAudio TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating table', err.message);
                } else {
                    console.log('Database synced with new schema.');
                }
            });
        });
    }
});

// API Routes
app.post('/api/stories', async (req, res) => {
    const { portrait, storyType, storyText, storyAudio } = req.body;

    if (!portrait) {
        return res.status(400).json({ error: 'Portrait is required' });
    }

    try {
        console.log('Starting All-in-One AI Pipeline (Replicate)...');

        // Step 1: Generate realistic face from sketch using SDXL img2img
        let aiPortraitUrl = portrait;
        if (process.env.REPLICATE_API_TOKEN) {
            console.log('Generating AI Portrait...');
            const imageOutput = await replicate.run(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                {
                    input: {
                        image: portrait, // Base64 or URL
                        prompt: "A beautifully detailed portrait photograph of a realistic Nigerian person, front facing, photorealistic, 8k, cinematic studio lighting",
                        prompt_strength: 0.85,
                        num_inference_steps: 30
                    }
                }
            );
            const outputVal = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
            aiPortraitUrl = outputVal?.url ? outputVal.url() : outputVal;
        }

        // Step 1.5: If Text, Generate TTS Audio
        let audioSource = storyAudio;
        if (process.env.REPLICATE_API_TOKEN && storyType === 'text' && storyText) {
            console.log('Waiting 11 seconds to prevent Replicate Rate Limiting (429)...');
            await new Promise(resolve => setTimeout(resolve, 11000));
            console.log('Generating TTS Audio...');
            const audioOutput = await replicate.run(
                "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
                {
                    input: {
                        prompt: storyText,
                        text_temp: 0.7,
                        output_full: false
                    }
                }
            );
            // Bark usually returns an object with audio, array or buffer URL
            const rawAudio = (audioOutput && audioOutput.audio_out) || audioOutput;
            audioSource = rawAudio?.url ? rawAudio.url() : rawAudio;
        }

        // Step 2: LipSync using SadTalker (if we have audio)
        let animatedVideoUrl = null;
        if (process.env.REPLICATE_API_TOKEN && audioSource) {
            console.log('Waiting 11 seconds to prevent Replicate Rate Limiting (429)...');
            await new Promise(resolve => setTimeout(resolve, 11000));
            console.log('Generating LipSync Video with SadTalker...');
            const videoOutput = await replicate.run(
                "cjwbw/sadtalker:a519cc0cfebaaeade068b23899165a11ec76aaa1d2b313d40d214f204ec957a3",
                {
                    input: {
                        source_image: aiPortraitUrl,
                        driven_audio: audioSource,
                        still: true,
                        enhancer: "gfpgan"
                    }
                }
            );
            animatedVideoUrl = videoOutput?.url ? videoOutput.url() : videoOutput;
        }

        console.log('AI Pipeline complete. Saving to DB...');
        const sql = `INSERT INTO stories (originalPortrait, aiPortraitUrl, animatedVideoUrl, storyType, storyText, storyAudio) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [portrait, aiPortraitUrl || null, animatedVideoUrl || null, storyType || 'text', storyText || null, storyAudio || null];

        db.run(sql, params, function (err) {
            if (err) {
                console.error('Error inserting story:', err.message);
                return res.status(500).json({ error: 'Failed to create story' });
            }
            res.status(201).json({
                message: 'Story created successfully',
                id: this.lastID,
                aiPortraitUrl,
                animatedVideoUrl
            });
        });

    } catch (error) {
        console.error('AI Pipeline Error:', error);
        if (error.response?.status === 429 || (error.message && error.message.includes('429'))) {
            return res.status(429).json({ error: 'Replicate rate limit exceeded (1 request per 10s on a $5 account). Please wait a few seconds and try clicking generate again.' });
        }
        if (error.response?.status === 402 || (error.message && error.message.includes('402'))) {
            return res.status(402).json({ error: 'Insufficient credits on Replicate account. Please add $5 at replicate.com/billing completely unlock all features.' });
        }
        res.status(500).json({ error: 'AI processing failed', details: error.message });
    }
});

app.get('/api/stories', (req, res) => {
    const sql = `SELECT * FROM stories ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching stories:', err.message);
            return res.status(500).json({ error: 'Failed to fetch stories' });
        }
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
