import discord
from discord.ext import commands, tasks
import re
from io import BytesIO
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timezone
import json
import aiohttp
import asyncio
from fflogs_functions import *
from sleeper_agents.sleeper_agent_manager import agentManager
import threading
from server import MyHandler, PORT
from http.server import HTTPServer
import json

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

    agentManager.set_message(message)
    await agentManager.run_agents()

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
async def addme(ctx, name, surname, server):

    data = {
        'name': name,
        'surname': surname,
        'server': server,
        'discord_id' : ctx.message.author.name
    }

    async with ctx.typing():
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{api_url}/register", json=data) as response:
                    response_text = await response.text()

                    if response.status != 200:
                        await ctx.send(f"Error {response.status}: {response_text}")
                        return

        except aiohttp.ClientError as err:
            await ctx.send(f"Error: {err}")
            return

    await ctx.send(response_text)

def run_server():
    with HTTPServer(("0.0.0.0", PORT), MyHandler) as server:
        server.serve_forever()

threading.Thread(target=run_server, daemon=True).start()

bot.run(os.getenv("API_KEY"))
