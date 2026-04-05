from ..sleeper_agent import *
import asyncio

class AgentSkeleton(SleeperAgent):
    async def action(self):
        if self.proc():
            msg = await self.message.reply(file=discord.File("/app/images/skeleton-running.gif"))
            await asyncio.sleep(1.5)
            await msg.delete()
            return True
        return False