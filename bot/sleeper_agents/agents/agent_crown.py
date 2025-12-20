from ..sleeper_agent import *

class AgentCrown(SleeperAgent):
    async def action(self):
        if self.proc() and "crown" in self.message.content:
            await self.message.reply(file=discord.File("/app/images/crown.gif"))
            return True
        return False