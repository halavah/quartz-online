const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 31200;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  // Decode URL to handle Chinese characters
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Build the file path
  let filePath = path.join(__dirname, 'out', pathname);

  // Check if path is a directory and append index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(pathname)) {
    // Try adding /index.html for paths without extension
    const dirPath = path.join(__dirname, 'out', pathname, 'index.html');
    if (fs.existsSync(dirPath)) {
      filePath = dirPath;
    } else {
      // Try adding .html extension
      filePath = path.join(__dirname, 'out', pathname + '.html');
    }
  }

  // Get file extension for MIME type
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'text/plain';

  // Read the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try to serve 404.html
      fs.readFile(path.join(__dirname, 'out', '404.html'), (err404, data404) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(data404 || '<h1>404 - Page Not Found</h1>');
      });
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});