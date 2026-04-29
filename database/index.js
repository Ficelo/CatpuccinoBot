const express = require('express');
const pgp = require('pg-promise')();

const dotenv = require("dotenv");

dotenv.config();

const db = pgp('postgres://' + process.env.DB_CONNECTION);
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/characters/:name", async (req, res) => {
    try {
        const data = await db.oneOrNone(
            'SELECT * FROM characters WHERE name = $1',
            [req.params.name]
        );

        if (!data) {
            return res.status(404).json({ error: 'Character not found' });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post("/characters", async (req, res) => {
    try {

        const data = await db.query(
            'INSERT INTO characters (discord_id, name, surname, server, ffxiv_id) VALUES ($1, $2, $3, $4, $5)', 
            [req.body.discord_id, req.body.name, req.body.surname, req.body.server, req.body.ffxiv_id]
        );
        
        if(!data) {
            return res.status(404).json({ error : 'Error inserting into the dabatase'});
        }
      
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({error : 'Server error'});
    }
});

app.get("/agents", async (req, res) => {
  try {
    const data = await db.query(
      'SELECT name, enabled FROM agents'
    );

    if (!data) {
      return res.status(404).json({error : 'No agents found'});
    }

    res.json(data);
    console.log(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({error : 'Server error'});
  }
});

app.get("/agents/:name", async (req, res) => {
  try {
    const data = await db.oneOrNone(
      'SELECT * FROM agents WHERE name = $1',
      [req.params.name]
    );
    
    if (!data) {
      return res.status(404).json({ error : 'Agent not found' });
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Server error' });
  }
});

app.post("/agents", async (req, res) => {
  try {

    const data = await db.query(
      'INSERT INTO agents (name, enabled) VALUES ($1, $2)',
      [req.params.name, req.params.enabled]
    );

    if (!data) {
      return res.status(404).json({ error : 'Error inserting into the database' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error : 'Server error'});
  }
});

app.get("/channels/:name", async (req, res) => {
  try {

    const data = await db.oneOrNone(
      'SELECT * FROM channels WHERE name = $1',
      [req.params.name]
    );

    if (!data) {
      return res.status(404).json({ error : 'Server error' });
    }

    res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error : 'Server error' });
    }
});

app.post("/channels", async (req, res) => {
  try {

    const data = await db.query(
      'INSERT INTO channels (name) VALUES ($1)',
      [req.params.name]
    );

    if(!data) {
      return res.status(404).json({ error : 'Error inserting into the database' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Server error' });
  }
});

app.get("/allowed_channel/:agent_name", async (req, res) => {
  try {

    const data = await db.query(
      'SELECT channels.name FROM agents JOIN allowed_channels ON agents.id = allowed_channels.agent_id JOIN channels on allowed_channels.id = channels.id WHERE agents.name = $1 AND allowed_channel = true;'
      [req.params.agent_name]
    );

    if (!data) {
      return res.status(404).json({ error : 'Server error' });
    }

    res.json(data);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error : 'Server error' });
  }
});

app.listen(3002, () => {
  console.log("Catpuccino backend running on 3001");
});
