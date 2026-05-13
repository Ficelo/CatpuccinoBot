import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sleeper_agents.agents.agent_hypnosis import AgentHypnosis

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentHypnosis("")

    agent.proc = MagicMock(return_value=True)

    mock_deleted_message = AsyncMock()
    mock_message = AsyncMock()
    mock_message.content = ""
    mock_message.reply.return_value = mock_deleted_message

    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_hypnosis.discord.File") as mock_file:
        with patch("sleeper_agents.agents.agent_hypnosis.asyncio.sleep", new_callable=AsyncMock):
            result = await agent.action()

            assert result is True
            mock_file.assert_called_once_with("/app/images/hypnosis 2.gif")
            mock_deleted_message.delete.assert_awaited_once()


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentHypnosis("")

    agent.proc = MagicMock(return_value=False)

    mock_message = MagicMock()
    mock_message.content = ""
    mock_message.reply = AsyncMock()

    agent.message = mock_message

    result = await agent.action()

    assert result is False
    mock_message.reply.assert_not_called()
