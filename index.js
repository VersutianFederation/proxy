var https = require('https');
var fs = require('fs');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.versutian.site/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.versutian.site/fullchain.pem', 'utf8')
};

var httpsProxyServer = https.createServer(options, function(req, res) {
  if (req.headers.host) {
    if (req.headers.host === 'api.versutian.site') {
      proxy.web(req, res, { target: 'http://127.0.0.1:3000' });
    } else if (req.headers.host === 'forums.versutian.site') {
      proxy.web(req, res, { target: 'https://127.0.0.1:5060' });
    }
  }
});

httpsProxyServer.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, { target: 'wss://127.0.0.1:5060' });
});

httpsProxyServer.listen(443);

proxy.on('error', function(e) {
  console.log(e);
});
