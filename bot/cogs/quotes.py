from discord.ext import commands
import discord
from dotenv import load_dotenv
import os
import aiohttp
from io import BytesIO

from client.client import Client

class Quotes(commands.Cog):

    def __init__(self, bot):
        load_dotenv()
        self.bot = bot
        self.quote_channel_id = os.getenv("QUOTE_CHANNEL_ID")
        self.api_url = os.getenv("API_URL", "http://localhost:3000")
        self.ignore_channels = [
                713303906763014187, 
                1385259550059532419, 
                1378678807619436676, 
                1382399560508379247, 
                1445053975534637228, 
                1399714589024718910, 
                1437724259781967903, 
                1402303350682419322, 
                1498241900170182686, 
                1498242273459048499, 
                1498242037697478676, 
                1498242435359309985
        ]
        self.client = Client("http://database:3002")
        self.processing_quotes = set()

    async def make_quote_from_message(self, message, author=None):

        if message.id in self.processing_quotes:
            return
        self.processing_quotes.add(message.id)
        
        if self.quote_channel_id != None:
            self.quote_channel_id = int(self.quote_channel_id)
        else:
            print("quote_channel_id is None")
            return

        quote_channel = self.bot.get_channel(self.quote_channel_id)

        if author:
            text = message.content.split("\"")[1]
        else:
            text = message.content

        data = {
            "text" : text, 
            "author_avatar" : author.display_avatar.url if author else message.author.display_avatar.url 
        }

        async with quote_channel.typing():
            try :
                async with aiohttp.ClientSession() as session:
                    async with session.post(f"{self.api_url}/quote", json=data) as response:
                        if response.status != 200:
                            text = await response.text()
                            text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                            await quote_channel.send(f"Server error: {text}")
                            return
                        img_bytes = BytesIO(await response.read())
            except aiohttp.ClientError as err:
                await quote_channel.send(f"Error : {err}")
                return

        img_bytes.seek(0)
        if data["text"] != "":
            posted_quote = await quote_channel.send(content=f"Og message : {message.jump_url}",file=discord.File(img_bytes, filename="quote.png"))
        else:
            await quote_channel.send(content=f"Og message : {message.jump_url}")
        if message.attachments:
            files = []

            for attachement in message.attachments:
                file = await attachement.to_file()
                files.append(file)
            if data["text"] != "":
                await quote_channel.send(files=files, reference=posted_quote)
            else:
                await quote_channel.send(files=files)
        self.client.add_quote(message.id, message.content)
        return

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):

        channel = self.bot.get_channel(payload.channel_id)
        message = await channel.fetch_message(payload.message_id)
        
        if message.guild.id != 1337925783720558652:
            return

        if self.client.is_message_in_quotes(message.id):
            return

        for reaction in message.reactions:
            print(reaction)
            if reaction.count >= 5 and channel.id not in self.ignore_channels:
                await self.make_quote_from_message(message)
                return

    @commands.command()
    async def makeQuote(self, ctx):
        if ctx.message.mentions != []:
            await self.make_quote_from_message(ctx.message, author=ctx.message.mentions[0])
    

async def setup(bot):
    await bot.add_cog(Quotes(bot))

