import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_mudae import AgentMudae

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentMudae("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "$wa"
    agent.message = mock_message

    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_mudae.discord.File") as mock_file:

        result = await agent.action()

        assert result is True

        mock_file.assert_called_once_with("/app/images/dog.png")

        mock_message.reply.assert_awaited_once()


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentMudae("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
