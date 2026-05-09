from discord.ext import commands
from dotenv import load_dotenv
import os
import aiohttp


class Admin(commands.Cog):

    def __init__(self, bot):
        load_dotenv()
        self.bot = bot
        self.api_url = os.getenv("API_URL", "http://localhost:3000")

    @commands.command()
    async def addme(self, ctx, name, surname, server):
        data = {
            'name': name,
            'surname': surname,
            'server': server,
            'discord_id' : ctx.message.author.name
        }

        async with ctx.typing():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(f"{self.api_url}/register", json=data) as response:
                        response_text = await response.text()

                        if response.status != 200:
                            await ctx.send(f"Error {response.status}: {response_text}")
                            return

                        await ctx.send(response_text)
            except aiohttp.ClientError as err:
                await ctx.send(f"Error: {err}")
                return




async def setup(bot):
    await bot.add_cog(Admin(bot))
