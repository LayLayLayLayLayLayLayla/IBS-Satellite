const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' })); 

// Storage for multiple channels
let channels = {};

// GET feed for a specific channel
app.get('/feed/:channelId', (req, res) => {
    const id = req.params.channelId.toLowerCase()
    if (channels[id]) {
        res.send(channels[id]);
    } else {
        res.send({ isLive: false });
    }
});

app.get('/channels', (req, res) => {
    // Returns an array of keys from the channels object
    const activeChannels = Object.keys(channels);
    res.send(activeChannels);
});

// POST broadcast for a specific channel
app.post('/broadcast/:channelId', (req, res) => {
    const id = req.params.channelId.toLowerCase()
    const data = req.body

    if (!channels[id]) {
        channels[id] = {
            camera: [0,0,0,1,0,0,0,1,0,0,0,1],
            players: [],
            scene: [],
            isLive: false,
            lastSeen: Date.now()
        }
    }

    channels[id].camera = data.camera
    channels[id].players = data.players
    channels[id].lastSeen = Date.now()
    channels[id].isLive = true

    // only overwrite scene on full scans, never null it out
    if (data.scene && data.scene.length > 0) {
        channels[id].scene = data.scene
    }

    res.send({ status: "Success", channel: id })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IBS Satellite multiplexer active on port ${PORT}`));

setInterval(() => {
    const now = Date.now();
    for (const id in channels) {
        // If we haven't heard from this channel in 15 seconds, kill it
        if (now - channels[id].lastSeen > 15000) {
            console.log(`IBS: Closing dead channel [${id}]`);
            delete channels[id];
        }
    }
}, 10000);