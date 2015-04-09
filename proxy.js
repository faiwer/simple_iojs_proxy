"use strict";

/**
 * run: iojs --harmony_arrow_functions proxy.js
 *
 * nginx:
 * location ~ ^/api.*$ {
 * 		proxy_pass http://127.0.0.1:3001;
 * 		proxy_set_header X-Real-IP $remote_addr;
 * 		proxy_set_header Host $host;
 * 		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 * }
 */

let hostname = '%hostname%';
let port = 3001;
let auth = '%user%:%pass%';
let http = require('http');

http.createServer((clientReq, clientRes) =>
{
	let opts =
	{
		hostname: hostname,
		port: 80,
		path: clientReq.url,
		auth: auth,
		headers: clientReq.headers,
		method: clientReq.method
	};
	opts.headers.host = hostname;

	console.info('serve: %s %s', clientReq.method, clientReq.url);

	let proxy = http.request(opts, (proxyRes) =>
	{
		proxyRes.addListener('data', (chunk) => clientRes.write(chunk, 'binary'));
		proxyRes.addListener('end', () => clientRes.end());
		clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
	});

	clientReq.addListener('data', (chunk) => proxy.write(chunk, 'binary'));
	clientReq.addListener('end', () => proxy.end());
}).listen(port);