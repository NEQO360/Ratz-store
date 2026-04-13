let app;
try {
  app = require('../backend/server');
} catch (err) {
  console.error('Failed to load backend:', err);
  app = (req, res) => {
    res.status(500).json({
      error: 'Server initialization failed',
      message: err.message,
      stack: err.stack
    });
  };
}

module.exports = app;
