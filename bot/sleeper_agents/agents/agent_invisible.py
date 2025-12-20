from ..sleeper_agent import *

class AgentInvisible(SleeperAgent):
    async def action(self):
        if self.proc() and ("invincible" in self.message.content.lower() or "invisible" in self.message.content.lower()):
            await self.message.reply(file=discord.File("/app/images/invisible.gif"))
            return True
        return False