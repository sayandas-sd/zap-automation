import express from "express";
const port = 3000
const app = express();


app.post("/webhook", (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})