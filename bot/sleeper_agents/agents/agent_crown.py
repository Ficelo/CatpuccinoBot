from ..sleeper_agent import *

class AgentCrown(SleeperAgent):
    async def action(self):
        if "crown" in self.message.content and self.proc():
            await self.message.reply(file=discord.File("/app/images/crown.gif"))
            return True
        return False