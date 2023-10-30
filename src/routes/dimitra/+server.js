import http from 'http';
import axios from 'axios';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/getWebpage') {
    try {
      const response = await axios.get('https://www.auth.gr/weekly-menu/');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response.data));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching data');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); // Use res.writeHead to set status code to 404
    res.end('Not Found');
  }
});

const port = 5173; // Change this to the desired port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});