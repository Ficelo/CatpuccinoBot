from ..sleeper_agent import *

class AgentGaius(SleeperAgent):
    async def action(self):
        if self.proc() and ("devastating" in self.message.content.lower() or "devastation" in self.message.content.lower()):
            await self.message.reply(file=discord.File("/app/images/gaius.gif"))
            await self.message.reply("Tell me...for whom do you fight? ")
            await self.message.reply("Hmph! Do you believe in Eorzea? ")
            await self.message.reply("Eorzea's unity is forged of falsehoods. Its city-states are built on deceit. And its faith is an instrument of deception.")
            await self.message.reply("It is naught but a cobweb of lies. To believe in Eorzea is to believe in nothing. ")
            await self.message.reply("In Eorzea, the beast tribes often summon gods to fight in their stead─though your comrades only rarely respond in kind. Which is strange, is it not?")
            await self.message.reply("Are the “Twelve” otherwise engaged? I was given to understand they were your protectors. If you truly believe them your guardians, why do you not repeat the trick that served you so well at Carteneau, and call them down?")
            await self.message.reply("They will answer─so long as you lavish them with crystals and gorge them on aether. ")
            await self.message.reply("Your gods are no different from those of the beasts─eikons every one. Accept but this, and you will see how Eorzea's faith is bleeding the land dry.")
            await self.message.reply("Nor is this unknown to your masters. Which prompts the question: why do they cling to these false deities? What drives even men of learning─even the great Louisoix─to grovel at their feet?")
            await self.message.reply("The answer? Your masters lack the strength to do otherwise!".upper())
            await self.message.reply("For the world of man to mean anything, man must own the world.")
            await self.message.reply("To this end, he hath fought ever to raise himself through conflict─to grow rich through conquest.")
            await self.message.reply("And when the dust of battle settles, it is ever the strong who dictate the fate of the weak.")
            await self.message.reply("Knowing this, but a single path is open to the impotent ruler─that of false worship. A path which leads to enervation and death.")
            await self.message.reply("Only a man of power can rightly steer the course of civilization. And in this land of creeping mendacity, that one truth will prove its salvation.")
            await self.message.reply("Come, champion of Eorzea, face me! Your defeat shall serve as proof of my readiness to rule!".upper())
            await self.message.reply("It is only right that I should take your realm. For none among you has the power to stop me!".upper())
            
        return False