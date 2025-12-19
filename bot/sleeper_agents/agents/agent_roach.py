from ..sleeper_agent import *

class AgentRoach(SleeperAgent):
    async def action(self):
        if ("roach" in self.message.content.lower() or "ponker" in self.message.content.lower()) and self.proc():
            await self.message.add_reaction("🪳")
            return True
        return False