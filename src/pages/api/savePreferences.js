
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { focusTime, breakTime, favoriteTips } = req.body;

        // In a production app, you would save this to a database (e.g., MongoDB, PostgreSQL)
        console.log('Saving preferences:', { focusTime, breakTime, favoriteTips });

        return res.status(200).json({
            success: true,
            message: 'Preferences saved successfully!',
            timestamp: new Date().toISOString()
        });
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
