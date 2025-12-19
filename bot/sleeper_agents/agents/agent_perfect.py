from ..sleeper_agent import *

class AgentPerfect(SleeperAgent):
    async def action(self):
        if "perfect" in self.message.content.lower() and self.proc():
            await self.message.reply("DID SOMEONE SAY PERFECT ????")
            await self.message.reply("TIME FOR THE GOOOOAAAAT")
            await self.message.reply(file=discord.File("/app/images/alexander1.jpg"))
            await self.message.reply(file=discord.File("/app/images/alexander2.png"))
            await self.message.reply(file=discord.File("/app/images/alexander3.png"))
            await self.message.reply("RAAAAAAAAAAAAAA")
            return True
        return False