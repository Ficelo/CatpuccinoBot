import {
  propellerize,
  nerdify,
  duncify,
  dimmadomify,
  undertaleify,
  makeCompatibility2characters,
  makeCompatibilityOther,
  makeProgress
} from "./imageFusion.js";

import { getCodeFromName, getCodeFromNameOnLodestone } from "./main.js";
import { formatName } from "./utils.js";

import path from "path";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_API_URL;

const app = express();
app.use(express.json());

const hatDict = {
  propeller: propellerize,
  nerd: nerdify,
  dunce: duncify,
  dimmadome: dimmadomify,
  undertale: undertaleify
};

app.post("/hat", async (req, res) => {
  try {
    const body = req.body;

    if (!body.code) {
      if (body.name && body.surname && body.server) {
        body.code = await getCodeFromName(
          body.name,
          body.surname,
          body.server
        );
      } else {
        return res.status(400).json({
          error: "Missing character code or character info"
        });
      }
    }

    const resultPath = await hatDict[body.hat]({
      name:
        body.name && body.surname
          ? `${body.name} ${body.surname}`
          : "default",
      code: body.code
    });

    return res.sendFile(path.resolve(resultPath));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred",
      details: err.message
    });
  }
});

app.post("/progress", async (req, res) => {
  try {
    const { fight, progress } = req.body;

    const resultPath = await makeProgress(fight, progress);

    return res.sendFile(path.resolve(resultPath));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred",
      details: err.message
    });
  }
});

app.post("/compatibility", async (req, res) => {
  try {
    const body = req.body;

    if (!body.thing1?.name || !body.thing1?.surname || !body.thing1?.server) {
      return res.status(400).json({
        error: "Missing character info on the first character"
      });
    }

    body.thing1.code = await getCodeFromName(
      body.thing1.name,
      body.thing1.surname,
      body.thing1.server
    );

    let resultPath = "";

    if (body.mode === "") {
      if (!body.thing2?.name || !body.thing2?.surname || !body.thing2?.server) {
        return res.status(400).json({
          error: "Missing character info on second character"
        });
      }

      body.thing2.code = await getCodeFromName(
        body.thing2.name,
        body.thing2.surname,
        body.thing2.server
      );

      resultPath = await makeCompatibility2characters(
        body.thing1,
        body.thing2
      );

    } else if (body.mode === "-o") {
      resultPath = await makeCompatibilityOther(
        body.thing1,
        body.thing2
      );

    } else {
      return res.status(400).json({
        error: "Wrong mode selected"
      });
    }

    return res.sendFile(path.resolve(resultPath));

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred",
      details: err.message
    });
  }
});


app.post("/register", async (req, res) => {
  try {
    
    console.log(req.body);

    const charCode = await getCodeFromNameOnLodestone(req.body.name, req.body.surname, req.body.server);
    
    if (charCode) {

      const result = await fetch(`${databaseUrl}/characters`, {
        method: 'POST',
        body: JSON.stringify({
          discord_id: req.body.discord_id,
          name: formatName(req.body.name),
          surname: formatName(req.body.surname),
          server: formatName(req.body.server),
          ffxiv_id: charCode
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.json(result); 


    }
  } catch (err) {
    console.error(err);
    res.status(500).json( { error : 'Internal server error in register' });
  }
});
          

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
