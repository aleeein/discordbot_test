async function randomLuck(message) {
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

module.exports = { randomLuck };