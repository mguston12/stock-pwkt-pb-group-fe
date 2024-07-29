// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Use CORS middleware
app.use(cors({
  origin: 'https://sekretariat-fe-pb-pbm-mmu-f05042c3e0c68a6e26f71af66cde7e70c14d2.gitlab.io', // Your frontend domain
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API route example
app.get('/api/hello', (req, res) => {
  res.send('Hello from the server!');
});

// Handle all other routes by sending the React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
