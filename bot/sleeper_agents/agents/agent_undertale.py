from ..sleeper_agent import *
import aiohttp
from io import BytesIO
import os

class AgentUndertale(SleeperAgent):
    async def action(self):
        if self.proc() and ("!me new" in self.message.content.lower() or "!me" in self.message.content.lower()):
            
            api_url = os.getenv("API_URL", "http://localhost:3000")

            with open("options.json", "r") as f:
                options = json.load(f)

            for user in options["registered_users"]:
                if user["discord_id"] == self.message.author.name:
                    data = {
                        "name" : user["ffxiv_name"],
                        "surname" : user["ffxiv_surname"],
                        "server": user["server"],
                        "code": user["ffxiv_id"],
                        "hat": "undertale"
                    }

                    try :
                        async with aiohttp.ClientSession() as session:
                            async with session.post(f"{api_url}/hat", json=data) as response:
                                if response.status != 200:
                                    text = await response.text()
                                    text = text[:3000] + "\n\n...(truncated)" if len(text) > 3000 else text
                                    print(f"Server error: {text}")
                                    return False
                                img_bytes = BytesIO(await response.read())
                    except aiohttp.ClientError as err:
                        print(f"Error : {err}")
                        return False

                    img_bytes.seek(0)
                    await self.message.reply(file=discord.File(img_bytes, filename="underale.png"))
            
            return True
        return False