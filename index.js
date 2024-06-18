require("dotenv/config");
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const { generateResponse } = require("./gemini"); // Import the Gemini function
const {
  addTask,
  viewTask,
  deleteTask,
  editTask,
  deleteAllTasks,
} = require("./tasks"); // Import task management functions
const { randomLuck } = require("./luck"); // Import luck function

const app = express();

/* Express setup */
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

/* Define prefix used to call the bot */
const PREFIX = "!ask";

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  if (!message.content.startsWith(PREFIX) && !message.content.startsWith("!gemini")) return;

  /* Remove the prefix from the message content to simplify command checks */
  const commandBody = message.content.startsWith(PREFIX)
    ? message.content.slice(PREFIX.length).trim()
    : message.content.slice("!gemini".length).trim();
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  /* Gemini AI command */
  if (message.content.startsWith("!gemini")) {
    try {
      const prompt = commandBody;
      const responseText = await generateResponse(prompt);
      await message.reply(responseText);
    } catch (error) {
      console.error(error);
      message.channel.send("Sorry, I couldn't process your request.");
    }
    return;
  }

  /* Task management commands */
  if (command === "addtask") {
    addTask(message);
  } else if (command === "viewtask") {
    viewTask(message);
  } else if (command === "deletetask") {
    deleteTask(message, args);
  } else if (command === "edittask") {
    editTask(message, args);
  } else if (command === "deletealltask") {
    deleteAllTasks(message);
  } else if (command === "test") {
    message.channel.send("masuk");
  } else if (command === "luck") {
    randomLuck(message);
  }
});

client.login(process.env.TOKEN);