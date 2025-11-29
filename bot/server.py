from http.server import SimpleHTTPRequestHandler, HTTPServer


PORT = 8008


class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().do_GET()


if __name__ == '__main__':
    print(f"Serving on http://localhost:{PORT}")
    with HTTPServer(('0.0.0.0', PORT), MyHandler) as server:
        server.serve_forever()