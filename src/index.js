const { port } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

mongoose.connect();

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || err,
    error: err.stack || err
  });
});

app.listen(port, () => console.log('Server started on port: ' + port));

module.exports = app;
