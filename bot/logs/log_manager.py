from client.client import Client


class LogManager:

    def __init__(self):
        self._logs = [] 
        self.client = Client("http://database:3002")

    def add_log(self, log):
        self._logs.append(log)
        self.client.add_log(log.generate_log())
        

logManager = LogManager()
