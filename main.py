import discord
from discord.ext import commands
import re
import requests
from io import BytesIO

descrption = "A banger bot to do some stuff in the Catputccino discord"

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="?", description=descrption, intents=intents)

messageLinkRegex = re.compile(r"https://discord.com/channels/(\d+)/(\d+)/(\d+)")


@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')


@bot.command()
async def hat(ctx, name, surname, server, code, hat="propeller"):

    data = {
        "name" : name,
        "surname" : surname,
        "code" : code
    }

    try :
        response = requests.post("http://localhost:3000/hat", json=data)
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
async def getStoryPoint(ctx, messageLink):

    match = messageLinkRegex.match(messageLink)
    if not match:
        await ctx.send("Message link doesn't seem to be in the right format")
        return

    guild_id, channel_id, message_id = map(int, match.groups())
    channel = bot.get_channel(channel_id)

    msg = await channel.fetch_message(message_id)
    await ctx.send(f"Fetched message: {api.getCharacterAchivements(msg.author.id)}")


bot.run("MTM5NzYyNjM2MzAwNjk0NzQxOQ.GHL_lK.iZsrP3Sv6qdqgKur9fUSuEq3ygLA3GGnb3rj-M")
