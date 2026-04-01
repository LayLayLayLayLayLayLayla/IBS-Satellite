const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' })); 

let currentBroadcast = {
    camera: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    players: [],
    scene: null,
    isLive: false
};

app.post('/broadcast', (req, res) => {
    const data = req.body;
    currentBroadcast.camera = data.camera;
    currentBroadcast.players = data.players;
    currentBroadcast.isLive = true;
    if (data.scene) {
        currentBroadcast.scene = data.scene;
        console.log("IBS: Full Scene Updated!");
    }
    res.send({ status: "Success" });
});

app.get('/feed', (req, res) => {
    res.send(currentBroadcast);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IBS Satellite active on port ${PORT}`));