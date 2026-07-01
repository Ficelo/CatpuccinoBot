from ..sleeper_agent import *
import discord


class AgentCrown(SleeperAgent):
    async def action(self):
        if self.proc() and "crown" in self.message.content:
            await self.message.reply(file=discord.File("/app/images/crown.gif"))
            self.make_log()
            return True
        return False
