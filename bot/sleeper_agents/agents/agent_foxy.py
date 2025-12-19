from ..sleeper_agent import *
import asyncio

class AgentFoxy(SleeperAgent):
    async def action(self):
        if self.proc():
            msg = await self.message.reply(file=discord.File("/app/images/foxy-jumpscare.gif"))
            await asyncio.sleep(1)
            await msg.delete()
            return True
        return False