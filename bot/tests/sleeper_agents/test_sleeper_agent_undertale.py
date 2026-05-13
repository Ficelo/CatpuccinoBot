import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from sleeper_agents.agents.agent_undertale import AgentUndertale

@pytest.mark.asyncio
async def test_action_proc_true():

    agent = AgentUndertale("")

    agent.proc = MagicMock(return_value=True)

    mock_message = AsyncMock()
    mock_message.content = "!me new"
    mock_message.author.name = "ficelo_"
    agent.message = mock_message

    agent.message = mock_message
    fake_image = b"fake image byte data"

    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.read = AsyncMock(return_value=fake_image)

    mock_post_ctx = MagicMock()
    mock_post_ctx.__aenter__ = AsyncMock(return_value=mock_response)
    mock_post_ctx.__aexit__ = AsyncMock(return_value=None)

    mock_session = MagicMock()
    mock_session.post.return_value = mock_post_ctx

    mock_client_session_ctx = MagicMock()
    mock_client_session_ctx.__aenter__ = AsyncMock(return_value=mock_session)
    mock_client_session_ctx.__aexit__ = AsyncMock(return_value=None)

    with (
        patch("sleeper_agents.agents.agent_undertale.aiohttp.ClientSession", return_value=mock_client_session_ctx),
        patch("sleeper_agents.agents.agent_undertale.discord.File") as mock_file,
        patch("builtins.open", create=True),
        patch("json.load", return_value={
                "registered_users": [
                    {
                        "discord_id": "ficelo_",
                        "ffxiv_name": "Test",
                        "ffxiv_surname": "User",
                        "server": "TestServer",
                        "ffxiv_id": "1234",
                    }
                ]
            })
        ):

            result = await agent.action()

            assert result is True

            mock_file.assert_called_once()
            mock_message.reply.assert_awaited_once()


@pytest.mark.asyncio
async def test_action_proc_false():

    agent = AgentUndertale("")

    agent.proc = MagicMock(return_value=False)
    agent.message = AsyncMock()
    result = await agent.action()

    assert result is False
    agent.message.reply.assert_not_called()
