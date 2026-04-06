const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' })); 

let channels = {};

// GET feed - Ensuring we return a valid object even if empty
app.get('/feed/:channelId', (req, res) => {
    const id = req.params.channelId.toLowerCase();
    if (channels[id]) {
        res.json(channels[id]);
    } else {
        // Return a "blank" live state so Roblox doesn't 404 or error out
        res.json({ 
            isLive: false, 
            camera: [0,0,0,1,0,0,0,1,0,0,0,1], 
            players: [], 
            scene: [] 
        });
    }
});

app.get('/channels', (req, res) => {
    res.json(Object.keys(channels));
});

// POST broadcast
app.post('/broadcast/:channelId', (req, res) => {
    const id = req.params.channelId.toLowerCase();
    const data = req.body;

    if (!channels[id]) {
        channels[id] = {
            camera: [0,0,0,1,0,0,0,1,0,0,0,1],
            players: [],
            scene: [],
            isLive: false,
            lastSeen: Date.now()
        };
    }

    channels[id].camera = data.camera || channels[id].camera;
    channels[id].players = data.players || [];
    channels[id].lastSeen = Date.now();
    channels[id].isLive = true;

    if (data.scene && data.scene.length > 0) {
        channels[id].scene = data.scene;
    }

    res.json({ status: "Success", channel: id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IBS Satellite active on port ${PORT}`));