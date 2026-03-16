const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Menyajikan file HTML dari direktori saat ini
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan server di port 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
