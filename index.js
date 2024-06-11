require("dotenv/config");
const express = require("express");
const app = express();
const { Client, GatewayIntentBits } = require("discord.js");

// Express setup
app.listen(3000, () => {
  console.log("Bot is ready");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* Discord setup */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const PREFIX = "!ask";

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(PREFIX)) return;

  /* Remove the prefix from the message content to simplify command checks */
  const command = message.content.slice(PREFIX.length).trim();

  if (command === "test") {
    message.channel.send("masuk");
  }

  if (command === "luck") {
    console.log("testing");
    const loadingMessage = await message.channel.send("please wait...");

    setTimeout(async () => {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      let finalMessage;
      if (randomNumber >= 7) {
        finalMessage = `You are very lucky! (Your number is ${randomNumber})`;
      } else {
        finalMessage = `Try again later. (Your number is ${randomNumber})`;
      }
      loadingMessage.edit(finalMessage);
    }, 2000);
  }
});

client.login(process.env.TOKEN);