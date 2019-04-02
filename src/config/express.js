const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const routes = require('../api/routes');

const { json, urlencoded } = require('body-parser');
app.use(json());
app.use(urlencoded({ extended: false }));



app.use('/api', routes);

module.exports = app;
