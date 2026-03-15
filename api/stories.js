import Replicate from "replicate";

export const config = {
    maxDuration: 60, // set max duration for Vercel Hobby tier
};

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    useFileOutput: false
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { portrait, storyType, storyText, storyAudio } = req.body;

    if (!portrait) {
        return res.status(400).json({ error: 'Portrait is required' });
    }

    try {
        console.log('Starting All-in-One AI Pipeline on Vercel Edge...');

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

        console.log('AI Pipeline complete. Returning URLs...');
        return res.status(201).json({
            message: 'Story created successfully',
            aiPortraitUrl,
            animatedVideoUrl
        });

    } catch (error) {
        console.error('AI Pipeline Error:', error);
        if (error.response?.status === 429 || (error.message && error.message.includes('429'))) {
            return res.status(429).json({ error: 'Replicate rate limit exceeded (1 request per 10s on a $5 account). Please wait a few seconds and try clicking generate again.' });
        }
        if (error.response?.status === 402 || (error.message && error.message.includes('402'))) {
             return res.status(402).json({ error: 'Replicate API credits expired. Please ask the admin to top up the account.' });
        }
        return res.status(500).json({ error: 'AI processing failed', details: error.message });
    }
}
