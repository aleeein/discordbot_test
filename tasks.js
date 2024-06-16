let tasks = [];

async function addTask(message) {
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

function viewTask(message) {
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

function deleteTask(message, args) {
  const taskNumber = parseInt(args[0]);
  if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
    message.channel.send("Invalid task number.");
  } else {
    const deletedTask = tasks.splice(taskNumber - 1, 1);
    message.channel.send(`Task deleted: ${deletedTask}`);
  }
}

async function editTask(message, args) {
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

function deleteAllTasks(message) {
  if (tasks.length === 0) {
    message.channel.send("No tasks to delete.");
  } else {
    tasks = [];
    message.channel.send("All tasks have been deleted.");
  }
}

module.exports = {
  addTask,
  viewTask,
  deleteTask,
  editTask,
  deleteAllTasks,
};