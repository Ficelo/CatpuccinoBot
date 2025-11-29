import discord
from discord.ext import commands, tasks
import re
import requests
from io import BytesIO
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timezone
import random
import json
import aiohttp
import asyncio
from fflogs_functions import *
from sleeper_agents import *
import threading
import subprocess

load_dotenv()

descrption = "A banger bot to do some stuff in the Catputccino discord"

api_url = os.getenv("API_URL", "http://localhost:3000")
options_file = "/app/options.json"

options = ""
sleeper_agent_names = ["mudae", "perfect", "invisible", "ponker", "la queefa", "dementia", "foxy", "hypnosis", "crown", "starwalker"]

with open(options_file, "r") as f:
    options = json.load(f)
    f.close()

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="?", description=descrption, intents=intents)

messageLinkRegex = re.compile(r"https://discord.com/channels/(\d+)/(\d+)/(\d+)")


@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')
    if not update_server_time.is_running():
        update_server_time.start()

@tasks.loop(seconds=60)
async def update_server_time():
    server_time = datetime.now(timezone.utc).strftime("%H:%M")
    await bot.change_presence(activity=discord.CustomActivity(name=f"Server time : {server_time}"))
    print(f"Status changed to : Server time : {server_time}")

@bot.listen('on_message')
async def on_message(message):
    if message.author == bot.user or message.content[0] == "?":
        return

    SleeperAgent.set_message(message)
    await SleeperAgent.run_all()


@bot.command()
async def progress(ctx, static=""):

    async with ctx.typing():
        
        try :
            data = await asyncio.to_thread(getLastFightHighestPercent)
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{api_url}/progress", json=data) as response:
                    if response.status != 200:
                        text = await response.text()
                        text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                        await ctx.send(f"Server error: {text}")
                        return
                    img_bytes = BytesIO(await response.read())
        except aiohttp.ClientError as err:
            await ctx.send(f"Error : {err}")
            return

    img_bytes.seek(0)
    await ctx.send(file=discord.File(img_bytes, filename="hat.png"))

@bot.command()
async def disable(ctx, agent):

    if "meowficer" not in [x.name.lower() for x in ctx.author.roles]:
        print([x.name.lower() for x in ctx.author.roles])
        print("not a meowficer")
        return

    if agent in sleeper_agent_names and agent not in options["disabled_sleeper_agents"]:
        
        disabled = options["disabled_sleeper_agents"]
        disabled.append(agent)

        options["disabled_sleeper_agents"] = disabled

        with open(options_file, "w") as f:
            json.dump(options, f)
            f.close()

    else:
        await ctx.send("Not a valid sleeper agent name or already disabled")

@bot.command()
async def enable(ctx, agent):

    if "meowficer" not in [x.name.lower() for x in ctx.author.roles]:
        print([x.name.lower() for x in ctx.author.roles])
        print("not a meowficer")
        return

    if agent in sleeper_agent_names and agent in options["disabled_sleeper_agents"]:
        
        disabled = options["disabled_sleeper_agents"]
        disabled.remove(agent)

        options["disabled_sleeper_agents"] = disabled

        with open(options_file, "w") as f:
            json.dump(options, f)
            f.close()

    else:
        await ctx.send("Not a valid sleeper agent name or already enabled")

@bot.command()
async def compatibility(ctx, thing1, thing2, mode=""):

    # -o for other on the second one
    
    async with ctx.typing():
        thing1List = thing1.split(" ")

        if mode == "":

            thing2List = thing2.split(" ")
            data = {
                "thing1" : {"name" : thing1List[0], "surname" : thing1List[1], "server": thing1List[2]},
                "thing2" : {"name" : thing2List[0], "surname" : thing2List[1], "server": thing2List[2]},
                "mode" : mode
            }
        else :
            data = {
                "thing1" : {"name" : thing1List[0], "surname" : thing1List[1], "server": thing1List[2]},
                "thing2" : thing2,
                "mode" : mode
            }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(f"{api_url}/compatibility", json=data) as response:
                    if response.status != 200:
                        text = await response.text()
                        text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                        await ctx.send(f"Server error: {text}")
                        return
                    img_bytes = BytesIO(await response.read())
            except aiohttp.ClientError as err:
                await ctx.send(f"Error : {err}")
           
        img_bytes.seek(0)
    await ctx.send(file=discord.File(img_bytes, filename="compatibility.png"))

@bot.command()
async def hat(ctx, name, surname, server, hat="propeller"):

    data = {
        "name" : name,
        "surname" : surname,
        "server" : server,
        "code" : "",
        "hat" : hat
    }

    async with ctx.typing():
        try :
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{api_url}/hat", json=data) as response:
                    if response.status != 200:
                        text = await response.text()
                        text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                        await ctx.send(f"Server error: {text}")
                        return
                    img_bytes = BytesIO(await response.read())
        except aiohttp.ClientError as err:
            await ctx.send(f"Error : {err}")
            return

    img_bytes.seek(0)
    await ctx.send(file=discord.File(img_bytes, filename="hat.png"))

@bot.command()
async def inponkers(ctx, size):
    ponker_height = 86.9
    converted = round((float(size) / ponker_height), 2);
    await ctx.send(f"{size}cm is {converted} Ponkers")
    

@bot.command()
async def patchnotes(ctx, patch):

    await ctx.send("Uuuuh lemme think real quick")
    await ctx.send(file=discord.File("./images/monkey.png"))
    await ctx.send("Getting patch notes from the lodestone...")

    time.sleep(3)

    embed = discord.Embed(
        title = f"=== PATCH NOTES FOR PATCH {patch} ==="
    )

    embed.add_field(name="Warrior", value="I dunno nerf it or something", inline=False)
    embed.add_field(name="Paladin", value="man idk give them one more confiteor combo", inline=False)
    embed.add_field(name="Dark knight", value="Nerfed oblation coz tbn too good", inline=False)
    embed.add_field(name="Gunbreaker", value="Like 1000 more potency on every gcd", inline=False)
    
    embed.add_field(name="", value="", inline=False)

    embed.add_field(name="Dragoon", value="Aura farming will now boost damage for 10 seconds", inline=False)
    embed.add_field(name="Monk", value="Uuuh monk rework", inline=False)
    embed.add_field(name="Ninja", value="Man idk who even plays ninja", inline=False)
    embed.add_field(name="Samurai", value="Re-added kaiten", inline=False)
    embed.add_field(name="Reaper", value="The game will now detect if you are listening to evanescence and give you a damage buff accordingly", inline=False)
    embed.add_field(name="Viper", value="Removed positionals as the job was too hard to play", inline=False)

    embed.add_field(name="", value="", inline=False)

    embed.add_field(name="Black mage", value="Added a third charge to ley lines", inline=False)
    embed.add_field(name="Summoner", value="Job is getting removed go play a real job", inline=False)
    embed.add_field(name="Reg mage", value="Red mage will now gain a damage buff if a melee job is forced into a ranged position", inline=False)
    embed.add_field(name="Pictomancer", value="Pictomancer now has a 10% buff to all it's skill when in an ultimate", inline=False)

    embed.add_field(name="", value="", inline=False)

    embed.add_field(name="Bard", value="Added one more random proc", inline=False)
    embed.add_field(name="Machinist", value="LMAOOOOOOO", inline=False)
    embed.add_field(name="Dancer", value="3 more en avant charges less go gang", inline=False)

    embed.add_field(name="", value="", inline=False)

    embed.add_field(name="White mage", value="Glare will now be weakened every time a healing spell is cast", inline=False)
    embed.add_field(name="Scholar", value="Removed the speed boost on Expediant since the job was too mobile", inline=False)
    embed.add_field(name="Astrologian", value="Removed cards and added schizophrenia", inline=False)
    embed.add_field(name="Sage", value="Sages will now be executed if they don't have kardia on a party member", inline=False)

    await ctx.send(embed=embed)
 
@bot.command()
async def baguettereact(ctx):
    
    message = await ctx.channel.fetch_message(ctx.message.reference.message_id)

    for _ in range(0, 10):
        await message.channel.send("🥖", reference=message)

def run_server_py():
    subprocess.run(["python", "server.py"], check=True)

threading.Thread(target=run_server_py, daemon=True).start()

bot.run(os.getenv("API_KEY"))
