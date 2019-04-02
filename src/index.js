const { port } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

mongoose.connect();

app.listen(port, () => console.log('Server started on port: ' + port));

module.exports = app;
