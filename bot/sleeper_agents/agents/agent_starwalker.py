from ..sleeper_agent import *

class AgentStarWalker(SleeperAgent):
    async def action(self):
        if self.proc():
            await self.message.channel.send(file=discord.File("/app/images/Starwalker.png"))
            await self.message.channel.send(f"This {self.message.channel.name} is pissing me off")
            await self.message.channel.send("I am the original Starwalker")
            return True
        return False