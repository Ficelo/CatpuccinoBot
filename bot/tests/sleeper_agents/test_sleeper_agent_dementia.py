import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_dementia import AgentDementia

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentDementia("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "!me new"
    agent.message = mock_message

    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_dementia.discord.File") as mock_file:

        result = await agent.action()

        assert result is True

        mock_file.assert_called_once_with("/app/images/dementia.gif")

        mock_message.reply.assert_awaited_once()


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentDementia("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
