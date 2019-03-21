const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

// MongoDB connection via mongoose
mongoose.connect();

// Start Express server
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

module.exports = app;
