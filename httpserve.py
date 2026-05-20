import socketserver
from http.server import SimpleHTTPRequestHandler

PORT = 3737
DIRECTORY = "/Volumes/502/jdp/consulting/consulting website"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, fmt, *args):
        pass  # suppress access logs

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
