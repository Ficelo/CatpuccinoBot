from ..sleeper_agent import *

class AgentHypnosis(SleeperAgent):
    async def action(self):
        if self.proc():
            msg = await self.message.reply(file=discord.File("/app/images/hypnosis 2.gif"))
            await asyncio.sleep(8)
            await msg.delete()
            return True
        return False