from ..sleeper_agent import *
import discord

class AgentMudae(SleeperAgent):
    async def action(self):
        if self.proc() and "$wa" in self.message.content.lower():
            await self.message.reply(file=discord.File("/app/images/dog.png"))
            return True
        return False
