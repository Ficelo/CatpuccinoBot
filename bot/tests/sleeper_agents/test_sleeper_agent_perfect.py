import pytest
from unittest.mock import AsyncMock, MagicMock, call, patch

from sleeper_agents.agents.agent_perfect import AgentPerfect 

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentPerfect("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "Well this is perfect !"
    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_perfect.discord.File") as mock_file:

        result = await agent.action()

        assert result is True

        mock_file.assert_has_calls([
            call("/app/images/alexander1.jpg"),
            call("/app/images/alexander2.png"),
            call("/app/images/alexander3.png")
        ])

        assert mock_message.reply.await_count == 6


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentPerfect("")

    agent.proc = MagicMock(return_value=False)

    mock_message = MagicMock()
    mock_message.content = "perfect"
    mock_message.reply = AsyncMock()

    agent.message = mock_message

    result = await agent.action()

    assert result is False
    mock_message.reply.assert_not_called()
