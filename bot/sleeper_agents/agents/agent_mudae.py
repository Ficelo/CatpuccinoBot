from ..sleeper_agent import *

class AgentMudae(SleeperAgent):
    async def action(self):
        if "$wa" in self.message.content.lower() and self.proc():
            await self.message.reply(file=discord.File("/app/images/dog.png"))
            return True
        return False