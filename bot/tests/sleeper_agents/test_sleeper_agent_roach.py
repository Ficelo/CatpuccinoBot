import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_roach import AgentRoach

@pytest.mark.asyncio
async def test_action_proc_true():
    agent = AgentRoach("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "something something Ponker"
    agent.message = mock_message

    result = await agent.action()
    assert result is True
    mock_message.add_reaction.assert_awaited_once()

@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentRoach("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
