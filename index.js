require("dotenv/config");
const express = require("express");
const app = express();
const { Client, GatewayIntentBits } = require("discord.js");

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
let tasks = [];

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(PREFIX)) return;

  /* Remove the prefix from the message content to simplify command checks */
  const commandBody = message.content.slice(PREFIX.length).trim();
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

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

  /* Task management commands */
  if (command === "addtask") {
    message.channel.send(
      "What task do you want to add? Use the template: (task name) - (deadline)"
    );

    const filter = (response) => response.author.id === message.author.id;
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const taskMessage = collected.first().content;

    tasks.push(taskMessage);
    message.channel.send(`Task added: ${taskMessage}`);
  }

  if (command === "viewtask") {
    if (tasks.length === 0) {
      message.channel.send("No tasks added yet.");
    } else {
      let taskList = "Tasks:\n";
      tasks.forEach((task, index) => {
        taskList += `${index + 1}. ${task}\n`;
      });
      message.channel.send(taskList);
    }
  }

  if (command === "deletetask") {
    const taskNumber = parseInt(args[0]);
    if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
      message.channel.send("Invalid task number.");
    } else {
      const deletedTask = tasks.splice(taskNumber - 1, 1);
      message.channel.send(`Task deleted: ${deletedTask}`);
    }
  }

  if (command === "edittask") {
    const taskNumber = parseInt(args[0]);
    if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
      message.channel.send("Invalid task number.");
    } else {
      message.channel.send(
        "Edit the task using the template: (task name) - (deadline)"
      );

      const filter = (response) => response.author.id === message.author.id;
      const collected = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      const newTaskMessage = collected.first().content;

      tasks[taskNumber - 1] = newTaskMessage;
      message.channel.send(`Task updated: ${newTaskMessage}`);
    }
  }

  if (command === "deletealltask") {
    if (tasks.length === 0) {
      message.channel.send("No tasks to delete.");
    } else {
      tasks = [];
      message.channel.send("All tasks have been deleted.");
    }
  }
});

client.login(process.env.TOKEN);