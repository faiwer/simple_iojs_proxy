# Simple IOJS proxy server script

Run: `iojs --harmony_arrow_functions proxy.js`. Sample-config for nginx:
```
nginx:
location ~ ^/api.*$ {
	proxy_pass http://127.0.0.1:3001;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
 ```