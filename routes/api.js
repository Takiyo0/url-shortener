const route = require("express").Router();
const quickDb = require("quick.db");

module.exports = () => {
    route.get("/", (req, res) => {
        res.status(200).json({hello: "world"});
    });

    route.get("/shorturl/:id", (req, res) => {
        let params = req.params;
        if (!params.id) return res.status(500).json({error: "internal server error (500)"});
        const links = quickDb.get("links");
        const result = Array.isArray(links) ? links.find(x => x.short === params.id) : undefined;
        if (!result || !result.url) return res.status(404).json({error: "Not found"});
        return res.redirect(result.url);
    });

    route.post("/shorturl", (req, res) => {
        let query = req.query, 
          body = req.body;
      let url = query.url ? query.url : body.url;
        if (!url || !checkValidUrl(url)) return res.status(200).json({error: "invalid url"});
        let shortUrl = randomString(5);
        quickDb.push("links", {
            short: shortUrl,
            url: url
        })
        return res.status(200).json({short_url: shortUrl, original_url: url});
    });

    return route;
}

function checkValidUrl(url) {
    try {
        const parsed = new URL(url);
      if(!["https:", "http:"].includes(parsed.protocol)) return false;
        return true;
    } catch (e) {
        return false;
    }
}

function randomString(length) {
    let words = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ1234567890";
    words = words.split("");
    let string = "", currentLength = 0;

    while (currentLength < length) {
        currentLength += 1;
        string += words[Math.floor(Math.random() * words.length)];
    }
    return string;
}