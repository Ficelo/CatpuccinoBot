import pytest
from unittest.mock import AsyncMock, MagicMock

from sleeper_agents.agents.agent_laqueefa import AgentLaQueefa

@pytest.mark.asyncio
async def test_action_proc_true():
    agent = AgentLaQueefa("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "Something something la queefa"
    agent.message = mock_message

    result = await agent.action()
    assert result is True
    mock_message.reply.assert_awaited_once()

@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentLaQueefa("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
