from fflogsapi import FFLogsClient
from dotenv import load_dotenv
import os

load_dotenv()

client = FFLogsClient(os.getenv("FFLOGS_CLIENT"), os.getenv("FFLOGS_SECRET"))

def getLastFightHighestPercent(guildID=135583):
    for page in client.reports(filters={ 'guildID': guildID }):
        best = 0
        fightTitle = ""
        for fight in page.object(0).fights():
            try:
                fightTitle = fight.encounter().name()
                if round(100 - fight.fight_percentage(), 2) > best:
                    best = round(100 - fight.fight_percentage(), 2)
                    #print(f"{fight.encounter().name()} : {round(100 - fight.fight_percentage(), 2)}%")
            except Exception as err:
                print(f"Error {err}")

    return {"fight": fightTitle, "progress": best}
    

client.close()


