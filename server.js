require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3020;
const API_BASE_URL = String(process.env.API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.all(['/proxy/*', '/api/proxy/*'], async (req, res) => {
  const targetPath = req.originalUrl.replace(/^\/(api\/)?proxy/, '');
  const targetUrl = `${API_BASE_URL}${targetPath}`;
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;
  delete headers['content-length'];
  delete headers['x-api-base'];

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body || {})
    });
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(502).json({ message: error.message || 'Falha ao acessar a API.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Painel em http://localhost:${PORT}`);
  });
}

module.exports = app;
