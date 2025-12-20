from ..sleeper_agent import *

class AgentDementia(SleeperAgent):
    async def action(self):
        if self.proc() and "!me new" in self.message.content.lower():
            await self.message.reply(file=discord.File("/app/images/dementia.gif"))
            return True
        return False