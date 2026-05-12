import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sleeper_agents.agents.agent_gaius import AgentGaius

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentGaius("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "Such devastation"
    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_gaius.discord.File") as mock_file:

        result = await agent.action()

        assert result is True
        mock_file.assert_called_once_with("/app/images/gaius.gif")
        assert mock_message.reply.await_count == 18


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentGaius("")

    agent.proc = MagicMock(return_value=False)

    mock_message = MagicMock()
    mock_message.content = "Such devastation"
    mock_message.reply = AsyncMock()

    agent.message = mock_message

    result = await agent.action()

    assert result is False
    mock_message.reply.assert_not_called()
