import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_invisible import AgentInvisible

@pytest.mark.asyncio
async def test_action_proc_true():
    agent = AgentInvisible("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "The invisible walls over there"
    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_invisible.discord.File") as mock_file:

        result = await agent.action()

        assert result is True

        mock_file.assert_called_once_with("/app/images/invisible.gif")

        mock_message.reply.assert_awaited_once()

@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentInvisible("invisible")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
