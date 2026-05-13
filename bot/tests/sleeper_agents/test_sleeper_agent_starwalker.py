import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sleeper_agents.agents.agent_starwalker import AgentStarWalker

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentStarWalker("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "Whatever idc"
    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_starwalker.discord.File") as mock_file:

        result = await agent.action()

        assert result is True
        mock_file.assert_called_once_with("/app/images/Starwalker.png")
        assert mock_message.channel.send.await_count == 3


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentStarWalker("")

    agent.proc = MagicMock(return_value=False)

    mock_message = MagicMock()
    mock_message.content = ""
    mock_message.reply = AsyncMock()

    agent.message = mock_message

    result = await agent.action()

    assert result is False
    mock_message.reply.assert_not_called()
