from http.server import SimpleHTTPRequestHandler, HTTPServer
from log_manager import logManager
from urllib.parse import urlparse, parse_qs
from settings import *
import json


PORT = 8008

def send_headers(object, content_type):
    object.send_response(200)
    object.send_header('Content-Type', content_type)
    object.send_header('Access-Control-Allow-Origin', '*')
    object.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
    object.send_header("Access-Control-Allow-Headers", "Content-Type")
    object.end_headers()

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

            send_headers(self, 'application/json')

            logs = [
                log.generate_log()
                for log in logManager.get_logs(name)
                if log is not None
            ]

            self.wfile.write(json.dumps(logs).encode('utf-8'))

        elif self.path.startswith('/enable'):

            parsed = urlparse(self.path)
            name = parse_qs(parsed.query).get("name", ["foxy"])[0]

            options = get_options()

            send_headers(self, 'text/plain')

            if name in options["disabled_sleeper_agents"]:
                options["disabled_sleeper_agents"].remove(name)
                set_options(options)
                self.wfile.write(f"Enabled {name}".encode('utf-8'))
            else:
                self.wfile.write(f"{name} is already enabled".encode('utf-8'))


        elif self.path.startswith('/disable'):
            
            parsed = urlparse(self.path)
            name = parse_qs(parsed.query).get("name", ["foxy"])[0]

            options = get_options()

            send_headers(self, 'text/plain')

            if name not in options["disabled_sleeper_agents"]:
                options["disabled_sleeper_agents"].append(name)
                set_options(options)
                self.wfile.write(f"Disabled {name}".encode('utf-8'))
            else:
                self.wfile.write(f"{name} is already disabled".encode('utf-8'))
        

        elif self.path.startswith('/status'):

            parsed = urlparse(self.path)
            name = parse_qs(parsed.query).get("name", ["foxy"])[0]

            options = get_options()
        
            send_headers(self, 'application/json')

            self.wfile.write(json.dumps({
                "enabled": name not in options["disabled_sleeper_agents"],
                "disabled": name in options["disabled_sleeper_agents"]
            }).encode('utf-8'))


        else:
            super().do_GET()
