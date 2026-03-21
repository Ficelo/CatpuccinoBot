from .agents.agent_crown import *
from .agents.agent_dementia import *
from .agents.agent_foxy import *
from .agents.agent_hypnosis import *
from .agents.agent_invisible import *
from .agents.agent_laqueefa import *
from .agents.agent_mudae import *
from .agents.agent_perfect import *
from .agents.agent_roach import *
from .agents.agent_starwalker import *
from .agents.agent_gaius import *
from .agents.agent_undertale import *

class SleeperAgentManager:

    def __init__(self):
        self._agents = []

    def add_agent(self, agent):
        self._agents.append(agent)

    def set_message(self, message):
        for agent in self._agents:
            agent.set_message(message)

    async def run_agents(self):
        for agent in self._agents:
            print(f"Running : {agent.name}")
            await agent.run()

agentManager = SleeperAgentManager()
agentManager.add_agent(AgentCrown("crown", 100, 100, 0))
agentManager.add_agent(AgentDementia("dementia", 0, 100, 10))
agentManager.add_agent(AgentFoxy("foxy", 1, 100, 50))
agentManager.add_agent(AgentHypnosis("hypnosis", 1, 100, 50))
agentManager.add_agent(AgentInvisible("invisible", 100, 100, 0))
agentManager.add_agent(AgentLaQueefa("laqueefa", 100, 100, 0))
agentManager.add_agent(AgentMudae("mudae", 1, 100, 50))
agentManager.add_agent(AgentPerfect("perfect", 10, 100, 0))
agentManager.add_agent(AgentRoach("roach", 10, 100, 0))
agentManager.add_agent(AgentStarWalker("starwalker", 1, 100, 500))
agentManager.add_agent(AgentGaius("gaius", 100, 100, 0))
agentManager.add_agent(AgentUndertale("undertale", 10, 100, 0))