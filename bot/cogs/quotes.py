from asyncio import wait
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
        self.ignore_channels = []
        self.client = Client("http://database:3002")

    
    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):
        channel = self.bot.get_channel(payload.channel_id)
        message = await channel.fetch_message(payload.message_id)

        if self.quote_channel_id != None:
            self.quote_channel_id = int(self.quote_channel_id)
        else:
            print("quote_channel_id is None")
            return

        for reaction in message.reactions:
            if reaction.count <= 5 and payload.channel_id not in self.ignore_channels and not self.client.is_message_in_quotes(message.content):
                quote_channel = self.bot.get_channel(self.quote_channel_id)

                data = {
                    "text" : message.content,
                    "author_avatar" : message.author.display_avatar.url
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
                await quote_channel.send(file=discord.File(img_bytes, filename="quote.png"))
                self.client.add_quote(payload.message_id, message.content)
                return


async def setup(bot):
    await bot.add_cog(Quotes(bot))

