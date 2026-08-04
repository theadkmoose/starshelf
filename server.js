const http = require('http');
const fs = require('fs');
const path = require('path');

const p = process.argv.indexOf('--port');
const port = p !== -1 ? process.argv[p + 1] : 3000;

http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  let filePath = path.join('docs', reqUrl === '/' ? 'hugo.html' : reqUrl);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'hugo.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    } else {
      const ext = path.extname(filePath);
      const contentType = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}).listen(port, () => console.log(`Server running on port ${port}`));
