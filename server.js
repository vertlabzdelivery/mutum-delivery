const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3020;
const DEFAULT_API_BASE = (process.env.API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.all('/proxy/*', async (req, res) => {
  const targetBase = String(req.get('x-api-base') || DEFAULT_API_BASE).replace(/\/$/, '');
  const targetPath = req.originalUrl.replace(/^\/proxy/, '');
  const targetUrl = `${targetBase}${targetPath}`;

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
    res.status(response.status);
    const text = await response.text();
    res.send(text);
  } catch (error) {
    res.status(502).json({ message: error.message || 'Falha ao acessar a API.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Painel do usuário em http://localhost:${PORT}`);
});
