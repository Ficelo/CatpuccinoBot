class LogManager:

    def __init__(self):
        self._logs = {}

    def add_agent(self, agent_name):
        self._logs[agent_name] = []

    def get_logs(self, agent_name):
        return self._logs[agent_name]

    def add_log(self, agent_name, log):
        self._logs[agent_name].append(log)

logManager = LogManager()