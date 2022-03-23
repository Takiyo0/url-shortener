const express = require("express");
const api = require("./routes/api");
const cors = require("cors");
const app = express();

app.use(cors({origin: ["*"]}));
app.set("View Engine", require("ejs"));
app.set("public", process.cwd() + "/views");
app.use(express.json());
app.use("/api", api());

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.listen(3090, () => console.log("Now listening to port RTX 3090"));