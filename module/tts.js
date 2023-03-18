const axios = require("axios");

module.exports = async (type, text) => {
    const tts = (await axios.post('https://demo-vox-proxy.i.kakao.com/v1/ttsURL', {
        "text": text,
        "engine": "plain",
        "voiceType": type,
        "toneType": "default",
        "outputType": "https"
    }, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.43"
        }
    }))["data"]["ttsURL"];

    return tts;
}