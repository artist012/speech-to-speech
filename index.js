const express = require("express");
const WebSocketServer = require("ws").Server;
const tts = require("./module/tts");

const exPort = 3001;
const wsPort = 3002;
const app = express();
const wss = new WebSocketServer({ port: wsPort });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static("./public"))

app.get('/sts', (req, res) => {
    res.sendFile("./views/index.html", { root: __dirname });
});

// Middleware
app.use((req, res, next) => {
    res.status(404).send('접근이 거부되었습니다');
});
app.use((err, req, res, next) => {
    if(!err) return next();
    console.log(err);
    res.status(500).send("서버에 오류가 발생했습니다");
});

wss.on("connection", async (ws) => {
    console.log("Websocket connected");
    ws.send(JSON.stringify({ command: "ttsType", data: require("./ttsType.json") }));

    ws.on("message", async (message) => {
        try {
            message = JSON.parse(message);
        } catch {
            ws.close();
            return;
        }
        
        if(message.hasOwnProperty("command")) {
            switch(message["command"]) {
                case "tts":
                    const audioLink = (await tts(message["type"], message["text"])).replace("https://demo-vox-proxy.i.kakao.com/v1/ttsURL/", "");
                    ws.send(JSON.stringify({ command: "speak", audio: audioLink }));
                    break;
                default:
                    ws.close();
                    break;
            }
        } else {
            ws.close();
        }
    });

    ws.on("close", () => {
        console.log("Websocket connection disconnected");
    });
});

app.listen(exPort, () => {
    console.log(`server on! http://localhost:${exPort}/sts`);
});