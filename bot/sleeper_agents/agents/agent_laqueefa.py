from ..sleeper_agent import *

class AgentLaQueefa(SleeperAgent):
    async def action(self):
        if self.proc() and self.message:
            text = list(self.message.content.lower())
            target = "laqueefa"
            idx = []
            t = ""
            c = 0

            for i in range(len(text)):
                if c < len(target) and text[i] == target[c]:
                    idx.append(i)
                    t += target[c]
                    c += 1

            if t != target:
                return

            for i in range(len(text)):
                if i not in idx:
                    text[i] = " "

            await self.message.reply("".join(text))
            return True
        return False