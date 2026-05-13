import os
import pytest
import discord
from discord.ext import commands

@pytest.fixture(scope="session", autouse=True)
def load_test_env():
    os.environ.setdefault("API_URL", "http://localhost:3000")
    os.environ.setdefault("QUOTE_CHANNEL_ID", "123456789012345678")
    yield

@pytest.fixture
def bot():
    intents = discord.Intents.default()
    return commands.Bot(command_prefix="?", intents=intents)
