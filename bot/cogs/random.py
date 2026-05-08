from discord.ext import commands
from dotenv import load_dotenv
import os


class Random(commands.Cog):

    def __init__(self, bot):
        load_dotenv()
        self.bot = bot
        self.api_url = os.getenv("API_URL", "http://localhost:3000")

    @commands.command()
    async def inponkers(self, ctx, size):
        ponker_height = 86.9
        converted = round((float(size) / ponker_height), 2);
        await ctx.send(f"{size}cm is {converted} Ponkers")


async def setup(bot):
    await bot.add_cog(Random(bot))
