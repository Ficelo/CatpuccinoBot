import datetime

class AgentLog:
    
    def __init__(self, text):
        self.timestamp = datetime.datetime.now()
        self.text = text
        self.proc = False
    
    def set_proc(self, proc):
        self.proc = proc

    def generate_log(self):
        return {
            "timestamp": self.timestamp.isoformat(),
            "log": self.text,
            "proc": self.proc
        }

    def __repr__(self):
        return f"{self.timestamp} : {self.text}"
