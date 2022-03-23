const express = require("express");
const api = require("./routes/api");
const bodyParser = require("body-parser");
const quickDb = require("quick.db");
const cors = require("cors");
const app = express();

app.use(cors({origin: ["*", "https://www.freecodecamp.org"]}));
app.set("View Engine", require("ejs"));
app.set("public", process.cwd() + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", api());

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.use("/:id", (req, res) => {
        let params = req.params;
        if (!params.id) return res.status(500).json({error: "internal server error (500)"});
        const links = quickDb.get("links");
        const result = Array.isArray(links) ? links.find(x => x.short === params.id) : undefined;
        if (!result || !result.url) return res.status(404).json({error: "Not found"});
        return res.redirect(result.url);
})

app.listen(3090, () => console.log("Now listening to port RTX 3090"));