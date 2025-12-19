from ..sleeper_agent import *

class AgentInvisible(SleeperAgent):
    async def action(self):
        if ("invincible" in self.message.content.lower() or "invisible" in self.message.content.lower()) and self.proc():
            await self.message.reply(file=discord.File("/app/images/invisible.gif"))
            return True
        return False