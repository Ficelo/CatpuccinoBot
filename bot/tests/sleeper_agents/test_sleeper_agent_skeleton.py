import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_skeleton import AgentSkeleton

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentSkeleton("")

    agent.proc = MagicMock(return_value=True)

    mock_deleted_msg = AsyncMock()
    mock_message = AsyncMock()
    mock_message.reply.return_value = mock_deleted_msg

    agent.message = mock_message

    with patch("sleeper_agents.agents.agent_skeleton.discord.File") as mock_file:
        with patch("sleeper_agents.agents.agent_skeleton.asyncio.sleep", new_callable=AsyncMock):

            result = await agent.action()

            assert result is True

            mock_file.assert_called_once_with("/app/images/skeleton-running.gif")

            mock_message.reply.assert_awaited_once()
            mock_deleted_msg.delete.assert_awaited_once()


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentSkeleton("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
