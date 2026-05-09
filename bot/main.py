import asyncio
import discord
from discord.ext import commands, tasks
import re
from dotenv import load_dotenv
import os
from datetime import datetime, timezone
import json
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
intents.reactions = True

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

def run_server():
    with HTTPServer(("0.0.0.0", PORT), MyHandler) as server:
        server.serve_forever()

threading.Thread(target=run_server, daemon=True).start()

async def main():
    async with bot:
        await bot.load_extension("cogs.quotes")
        await bot.load_extension("cogs.image_generation")
        await bot.load_extension("cogs.admin")
        await bot.load_extension("cogs.random")
        await bot.start(os.getenv("API_KEY", ""))

asyncio.run(main())
