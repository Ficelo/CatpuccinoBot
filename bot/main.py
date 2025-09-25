import discord
from discord.ext import commands
import re
import requests
from io import BytesIO
from dotenv import load_dotenv
import os

load_dotenv()

descrption = "A banger bot to do some stuff in the Catputccino discord"

api_url = os.getenv("API_URL", "http://localhost:3000")

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="?", description=descrption, intents=intents)

messageLinkRegex = re.compile(r"https://discord.com/channels/(\d+)/(\d+)/(\d+)")


@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')


@bot.command()
async def hat(ctx, name, surname, server, hat="propeller"):

    data = {
        "name" : name,
        "surname" : surname,
        "server" : server,
        "code" : "",
        "hat" : hat
    }

    try :
        response = requests.post(f"{api_url}/hat", json=data)
    except requests.exceptions.RequestException as err:
        await ctx.send(f"Error : {err}")
        return

    if response.status_code != 200:
        text = response.text if response.text else f"Status {response.status_code}"
        MAX = 3000
        if len(text) > MAX:
            text = text[:MAX] + "\n\n...(truncated)"
        await ctx.send(f"Server error: {text}")
        return
    
    img_bytes = BytesIO(response.content)
    img_bytes.seek(0)
    await ctx.send(file=discord.File(img_bytes, filename="hat.png"))


@bot.command()
async def baguettereact(ctx):
    
    message = await ctx.channel.fetch_message(ctx.message.reference.message_id)

    for _ in range(0, 10):
        await message.channel.send("🥖", reference=message)



bot.run(os.getenv("API_KEY"))
