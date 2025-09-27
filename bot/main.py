import discord
from discord.ext import commands, tasks
import re
import requests
from io import BytesIO
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timezone


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
    if not update_server_time.is_running():
        update_server_time.start()


@tasks.loop(seconds=60)
async def update_server_time():
    server_time = datetime.now(timezone.utc).strftime("%H:%M")
    await bot.change_presence(activity=discord.CustomActivity(name=f"Server time : {server_time}"))
    print(f"Status changed to : Server time : {server_time}")

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



bot.run(os.getenv("API_KEY"))
