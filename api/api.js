import {
  propellerize,
  nerdify,
  duncify,
  dimmadomify,
  makeCompatibility2characters,
  makeCompatibilityOther,
  makeProgress
} from "./imageFusion.js";

import { getCodeFromName } from "./main.js";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();
app.use(express.json());

const hatDict = {
  propeller: propellerize,
  nerd: nerdify,
  dunce: duncify,
  dimmadome: dimmadomify
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});