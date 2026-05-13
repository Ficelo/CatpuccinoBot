import random
from logs.log_manager import logManager
from logs.log import AgentLog
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
        self.log = AgentLog("")
        logManager.add_agent(self.name)

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
        self.log = AgentLog(f"{self.name} : rolled {roll}, {self.proc_chance_small}/{self.proc_chance_large} chance")
        return roll <= self.proc_chance_small
        
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
            self.log.set_proc(True)
        
        logManager.add_log(self.name, self.log)
        self.log = AgentLog("")

        self.reduce_proc_chance_large()

    # Override this to implement an agent
    async def action(self):
        return self.debuff > 100
