import discord
import random
import asyncio
import time

class SleeperAgent:
    _instances = []
    message = None
    message_timestamps = []

    def __init__(self, name, chance=0, cooldown=5):
        self.name = name
        self.chance = chance
        self.cooldown = cooldown
        self.last_trigger = 0
        SleeperAgent._instances.append(self)

    @staticmethod
    def register_message():
        now = time.time()
        SleeperAgent.message_timestamps.append(now)
        SleeperAgent.message_timestamps = [
            t for t in SleeperAgent.message_timestamps if now - t < 4
        ]

    def get_dynamic_chance(self):
        base = self.chance
        msgs = len(SleeperAgent.message_timestamps)
        if msgs > 6:
            base = max(1, int(base * 0.25))
        elif msgs > 3:
            base = max(1, int(base * 0.5))
        print("dynamic chance", base)
        return base

    async def run(self):
        if self.message is None:
            return
        if time.time() - self.last_trigger < self.cooldown:
            return
        if random.randint(1, 100) <= self.get_dynamic_chance():
            self.last_trigger = time.time()
            await self.action(self.message)

    async def action(self, message):
        pass

    @classmethod
    def set_message(cls, message):
        cls.message = message

    @classmethod
    async def run_all(cls):
        for instance in cls._instances:
            await instance.run()


class MudaeAgent(SleeperAgent):
    async def action(self, message):
        if "$wa" in message.content.lower():
            await message.reply(file=discord.File("./images/dog.png"))


class PerfectAgent(SleeperAgent):
    async def action(self, message):
        if "perfect" in message.content.lower():
            await message.reply("DID SOMEONE SAY PERFECT ????")
            await message.reply("TIME FOR THE GOOOOAAAAT")
            await message.reply(file=discord.File("./images/alexander1.jpg"))
            await message.reply(file=discord.File("./images/alexander2.png"))
            await message.reply(file=discord.File("./images/alexander3.png"))
            await message.reply("RAAAAAAAAAAAAAA")


class RoachAgent(SleeperAgent):
    async def action(self, message):
        if "roach" in message.content.lower() or "ponker" in message.content.lower():
         await message.add_reaction("🪳")


class DementiaAgent(SleeperAgent):
    async def action(self, message):
        if "!me new" in message.content.lower():
            await message.reply(file=discord.File("./images/dementia.gif"))


class CrownAgent(SleeperAgent):
    async def action(self, message):
        if "crown" in message.content:
            await message.reply(file=discord.File("./images/crown.gif"))


class FoxyAgent(SleeperAgent):
    async def action(self, message):
        msg = await message.reply(file=discord.File("./images/foxy-jumpscare.gif"))
        await asyncio.sleep(1)
        await msg.delete()


class HypnosisAgent(SleeperAgent):
    async def action(self, message):
        msg = await message.reply(file=discord.File("./images/hypnosis 2.gif"))
        await asyncio.sleep(8)
        await msg.delete()


class StarwalkerAgent(SleeperAgent):
    async def action(self, message):
        await message.channel.send(file=discord.File("./images/Starwalker.png"))
        await message.channel.send(f"This {message.channel.name} channel is pissing me off")
        await message.channel.send("I am the original                         Starwalker")

class InvisibleSleeperAgent(SleeperAgent):
    async def action(self, message):
        if "invincible" in message.content.lower() or "invisible" in message.content.lower():
            await message.reply(file=discord.File("./images/invisible.gif"))


class LaQueefaAgent(SleeperAgent):
    async def run(self):
        if self.message is None:
            return

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

    async def action(self, message):
        pass


mudae = MudaeAgent("mudae", 1)
perfect = PerfectAgent("perfect", 10)
roach = RoachAgent("roach", 10)
dementia = DementiaAgent("dementia", 10)
crown = CrownAgent("crown", 100)
foxy = FoxyAgent("foxy", 1)
hypnosis = HypnosisAgent("hypnosis", 1)
starwalker = StarwalkerAgent("starwalker", 1)
laqueefa = LaQueefaAgent("la queefa", 100)
invisible = InvisibleSleeperAgent("invincible", 100)
