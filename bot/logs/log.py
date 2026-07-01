import datetime

class AgentLog:
    
    def __init__(self, text, proccer):
        self.timestamp = datetime.datetime.now()
        self.text = text
        self.proccer = proccer
    
    def generate_log(self):
        return {
            "timestamp": self.timestamp.isoformat(),
            "log": self.text,
            "proccer": self.proccer
        }

    def __repr__(self):
        return f"{self.timestamp} : {self.text}"
