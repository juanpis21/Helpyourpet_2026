const https = require('https');
const data = JSON.stringify({email:'helpyourpet25@gmail.com'});
const options = {
  hostname: 'helpyourpet-2026.onrender.com',
  path: '/recuperar/solicitar',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = https.request(options, res => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});
req.on('error', err => console.error('err', err.message));
req.write(data);
req.end();
