const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const { json, urlencoded } = require('body-parser');
app.use(json());
app.use(urlencoded({ extended: false }));


module.exports = app;
