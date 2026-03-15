import Replicate from "replicate";

export const config = {
    maxDuration: 10,
};

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Prediction ID is required' });
    }

    try {
        const prediction = await replicate.predictions.get(id);
        
        return res.status(200).json(prediction);
    } catch (error) {
        console.error('Prediction Get Error:', error);
        return res.status(500).json({ error: 'Failed to fetch prediction status', details: error.message });
    }
}
