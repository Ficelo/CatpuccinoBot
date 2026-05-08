from discord.ext import commands
import discord
import aiohttp
from io import BytesIO
import os
from dotenv import load_dotenv

class ImageGeneration(commands.Cog):

    def __init__(self, bot):
        load_dotenv()
        self.bot = bot
        self.api_url = os.getenv("API_URL", "http://localhost:3000")
   
    async def download_and_send_image(self, ctx, endpoint, data, filename):
        async with ctx.typing():
            async with aiohttp.ClientSession() as session:
                    try:
                        async with session.post(f"{self.api_url}/{endpoint}", json=data) as response:
                            if response.status != 200:
                                text = await response.text()
                                text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                                await ctx.send(f"Server error: {text}")
                                return
                            img_bytes = BytesIO(await response.read())
                            img_bytes.seek(0)
                            await ctx.send(file=discord.File(img_bytes, filename=f"{filename}.png"))
                    except aiohttp.ClientError as err:
                        await ctx.send(f"Error : {err}")



    @commands.command()
    async def compatibility(self, ctx, thing1, thing2, mode=""):
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
            
            await self.download_and_send_image(ctx, "compatibility", data, "compatibility")

            
    @commands.command()
    async def hat(self, ctx, name, surname, server, hat="propeller"):

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
                    async with session.post(f"{self.api_url}/hat", json=data) as response:
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

        a

async def setup(bot):
    await bot.add_cog(ImageGeneration(bot))
