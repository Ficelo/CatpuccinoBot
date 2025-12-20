from http.server import SimpleHTTPRequestHandler, HTTPServer
from log_manager import logManager
from urllib.parse import urlparse, parse_qs
import json

PORT = 8008


class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'rb') as f:
                self.wfile.write(f.read())
        
        elif self.path.startswith('/log'):

            parsed = urlparse(self.path)
            name = parse_qs(parsed.query).get("name", ["foxy"])[0]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            logs = [
                log.generate_log()
                for log in logManager.get_logs(name)
                if log is not None
            ]

            self.wfile.write(json.dumps(logs).encode('utf-8'))
        
        else:
            super().do_GET()
