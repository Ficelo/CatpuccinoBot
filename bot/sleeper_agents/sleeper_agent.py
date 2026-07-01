import random
from logs.log import AgentLog
from logs.log_manager import LogManager
from settings import *


def isAgentEnabled(name):
    disabled_agents = []
    data = get_options()
    disabled_agents = data["disabled_sleeper_agents"]
    return (name not in disabled_agents)

class SleeperAgent:
    
    def __init__(self, name, proc_chance_small=1, proc_chance_large=100, debuff=0):
        self.name = name
        self.proc_chance_small = proc_chance_small
        self.proc_chance_large = proc_chance_large
        self.debuff = debuff

    def isEnabled(self):
        return isAgentEnabled(self.name)

    def set_message(self, message):
        self.message = message

    def reduce_proc_chance_large(self):
        if self.proc_chance_large <= 100:
            return
        self.proc_chance_large -= 1

    def proc(self):
        roll = random.randint(1, self.proc_chance_large)
        return roll <= self.proc_chance_small

    def make_log(self):
        logManager = LogManager()
        log = AgentLog(f"{self.name} : PROCCED {self.proc_chance_small}/{self.proc_chance_large} ", self.message.author.name)
        logManager.add_log(log.generate_log())
        
    async def run(self):
        if self.message is None:
            print("No message")
            return
        if not self.isEnabled():
            print(f"{self.name} is disabled")
            return
        
        procced = await self.action()
        if procced:
            self.proc_chance_large += self.debuff

        self.reduce_proc_chance_large()

    # Override this to implement an agent
    async def action(self):
        return self.debuff > 100
