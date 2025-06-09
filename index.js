const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.send("Muqaddas is running...");
});

app.listen(port, () => {
    console.log(`Muqaddas is running on: ${port}`);
});