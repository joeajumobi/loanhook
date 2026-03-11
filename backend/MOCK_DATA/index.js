const express = require("express");
const cors = require("cors");
const applicants = require("./generators/applicants");

const app = express();

app.use(cors());

const mockData = (req, res, generator) => {
    const count = req.query.count || 25;
    const data = [];

    for (let i =0; i < count; i++){
        data.push(generator());
    }

    res.json(data);
};

app.get("/applicants", (req, res) => {
    mockData(req, res, applicants);

});

app.listen(3000, () => console.log("API server running..."));