import discord
import random
import asyncio
import json

options_file = "/app/options.json"

class SleeperAgent:
    _instances = []
    message = None

    def __init__(self, name, proc_chance, cooldown_inc=50):
        self.name = name
        self.proc_chance = proc_chance
        self.cooldown = 0
        self.cooldown_inc = cooldown_inc
        SleeperAgent._instances.append(self)

    def isEnabled(self):
        try:
            with open(options_file, "r") as f:
                options = json.load(f)
            return self.name not in options.get("disabled_sleeper_agents", [])
        except FileNotFoundError:
            return True

    def tick_cooldown(self):
        self.cooldown = max(0, self.cooldown - 1)

    def try_proc(self):
        roll = random.randint(1, 100 + self.cooldown)
        proc = roll <= self.proc_chance
        print(f"{self.name} roll: {roll}, chance <= {self.proc_chance}, cooldown: {self.cooldown}, proc: {proc}")
        return proc

    async def run(self):
        if self.message is None:
            return
        if not self.isEnabled():
            return
        await self.action(self.message)

    async def action(self, message):
        pass

    @classmethod
    def set_message(cls, message):
        cls.message = message

    @classmethod
    async def run_all(cls):
        for agent in cls._instances:
            agent.tick_cooldown()
            await agent.run()


class MudaeAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc():
            if "$wa" in message.content.lower() and self.try_proc():
                await message.reply(file=discord.File("./images/dog.png"))
                self.cooldown += self.cooldown_inc


class PerfectAgent(SleeperAgent):
    async def action(self, message):
        if "perfect" in message.content.lower() and self.try_proc():
            await message.reply("DID SOMEONE SAY PERFECT ????")
            await message.reply("TIME FOR THE GOOOOAAAAT")
            await message.reply(file=discord.File("./images/alexander1.jpg"))
            await message.reply(file=discord.File("./images/alexander2.png"))
            await message.reply(file=discord.File("./images/alexander3.png"))
            await message.reply("RAAAAAAAAAAAAAA")
            self.cooldown += self.cooldown_inc


class RoachAgent(SleeperAgent):
    async def action(self, message):
        if ("roach" in message.content.lower() or "ponker" in message.content.lower()) and self.try_proc():
            await message.add_reaction("🪳")
            self.cooldown += self.cooldown_inc


class DementiaAgent(SleeperAgent):
    async def action(self, message):
        if "!me new" in message.content.lower() and self.try_proc():
            await message.reply(file=discord.File("./images/dementia.gif"))
            self.cooldown += self.cooldown_inc


class CrownAgent(SleeperAgent):
    async def action(self, message):
        if "crown" in message.content and self.try_proc():
            await message.reply(file=discord.File("./images/crown.gif"))
            self.cooldown += self.cooldown_inc


class FoxyAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc():
            msg = await message.reply(file=discord.File("./images/foxy-jumpscare.gif"))
            await asyncio.sleep(1)
            await msg.delete()
            self.cooldown += self.cooldown_inc


class HypnosisAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc():
            msg = await message.reply(file=discord.File("./images/hypnosis 2.gif"))
            await asyncio.sleep(8)
            await msg.delete()
            self.cooldown += self.cooldown_inc


class StarwalkerAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc():
            await message.channel.send(file=discord.File("./images/Starwalker.png"))
            await message.channel.send(f"This {message.channel.name} is pissing me off")
            await message.channel.send("I am the original Starwalker")
            self.cooldown += self.cooldown_inc


class InvisibleSleeperAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc():
            if ("invincible" in message.content.lower() or "invisible" in message.content.lower()) and self.try_proc():
                await message.reply(file=discord.File("./images/invisible.gif"))
                self.cooldown += self.cooldown_inc


class LaQueefaAgent(SleeperAgent):
    async def action(self, message):
        if self.try_proc() and self.message:
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
            self.cooldown += self.coold


# initialize agents
mudae = MudaeAgent("mudae", 1, 100)
perfect = PerfectAgent("perfect", 10, 0)
roach = RoachAgent("roach", 10, 0)
dementia = DementiaAgent("dementia", 10, 0)
crown = CrownAgent("crown", 100, 0)
foxy = FoxyAgent("foxy", 1, 50)
hypnosis = HypnosisAgent("hypnosis", 1, 50)
starwalker = StarwalkerAgent("starwalker", 1, 100)
laqueefa = LaQueefaAgent("la queefa", 100, 0)
invisible = InvisibleSleeperAgent("invincible", 100, 0)
