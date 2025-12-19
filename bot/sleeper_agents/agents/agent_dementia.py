from ..sleeper_agent import *

class AgentDementia(SleeperAgent):
    async def action(self):
        if "!me new" in self.message.content.lower() and self.proc():
            await self.message.reply(file=discord.File("/app/images/dementia.gif"))
            return True
        return False