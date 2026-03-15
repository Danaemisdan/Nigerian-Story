import Replicate from "replicate";

export const config = {
    maxDuration: 60,
};

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { model, input } = req.body;

    if (!model || !input) {
        return res.status(400).json({ error: 'Model and input are required' });
    }

    try {
        // Replicate's predictions.create strictly requires ONLY the 64-char version hash.
        // It crashes the Python container if we pass the "owner/name:" prefix.
        const versionHash = model.includes(':') ? model.split(':')[1] : model;

        const prediction = await replicate.predictions.create({
            version: versionHash,
            input: input
        });

        // Add an artificial 3-second delay here ONLY if we are worried about Replicate rate limits for creation
        // But predictions.create is lightweight.
        
        return res.status(201).json(prediction);
    } catch (error) {
        console.error('Prediction Create Error:', error);
        if (error.response?.status === 429 || error.message?.includes('429')) {
             return res.status(429).json({ error: 'Replicate rate limit exceeded. Wait 10s and retry.' });
        }
        return res.status(500).json({ error: 'Failed to create prediction', details: error.message });
    }
}
