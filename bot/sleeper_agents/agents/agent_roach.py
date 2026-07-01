from ..sleeper_agent import *

class AgentRoach(SleeperAgent):
    async def action(self):
        if self.proc() and ("roach" in self.message.content.lower() or "ponker" in self.message.content.lower()):
            await self.message.add_reaction("🪳")
            self.make_log()
            return True
        return False
