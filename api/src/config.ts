import dotenv from 'dotenv';

dotenv.config();;

interface Config {
  port: Number,
  nodeEnv: String
}

const config : Config = {
  port: Number(process.env.port) || 3000,
  nodeEnv: process.env.nodeEnv || "developement"
};

export default config;
  
