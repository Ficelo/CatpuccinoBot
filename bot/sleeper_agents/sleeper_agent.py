import discord
import random
import asyncio
import json


def isAgentEnabled(name):
    options_file = "/app/options.json"
    return True

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
        print(f"{self.name} : rolled {roll}, {self.proc_chance_small}/{self.proc_chance_large} chance")
        # Add logging here
        return roll <= self.proc_chance_small

    async def run(self):
        if self.message is None:
            print("No message")
            return
        if not self.isEnabled():
            print(f"{self.name} is disabled")
            return
        
        procced = await self.action()
        # Add logging here
        if procced:
            self.proc_chance_large += self.debuff
            # Add logging here

        self.reduce_proc_chance_large()

    # Override this to implement your agent
    def action(self):
        return True
