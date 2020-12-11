const Discord = require("discord.js");
const client = new Discord.Client();
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const config = require('./config.json');

client.login(config.BotToken);

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

client.on("ready", () => {
  console.log("I am ready!");
});
 
client.on("message", async (message) => {
    if(message.author.id != config.BotID){
        msgContent = message.content;
        if(msgContent.startsWith("!sp-start")){
            driver.get(msgContent.split(" ")[1]).then(async function(){
                driver.findElement(webdriver.By.id('button-play')).click();
                const quiztime = await driver.findElement(webdriver.By.id('time')).getText();
                message.channel.send("All the best! You've got " + quiztime + " minutes.");

            });
        }
        else if(msgContent.startsWith("!sp-time")){
            const quiztime = await driver.findElement(webdriver.By.id('time')).getText();
            message.channel.send("You've got " + quiztime + " minutes remaining.");
        }
        else if(msgContent.startsWith("!sp-pause")){
            driver.findElement(webdriver.By.id('pauseBox')).click();
        }
        else if(msgContent.startsWith("!sp-giveup")){
            driver.findElement(webdriver.By.id('giveUp')).click();
        }
        else if(msgContent.startsWith("!sp-presume")){
            driver.findElement(webdriver.By.id('presume')).click();
        }
        else{
            textInput = driver.findElement(webdriver.By.id('gameinput'));
            textInput.clear();
            await textInput.sendKeys(msgContent);
            checkText = (await driver.findElement(webdriver.By.id('gameTable')).getAttribute('innerHTML')).toLowerCase().indexOf(msgContent.toLowerCase());
            // console.log(checkText);
            if(checkText == -1){
                message.channel.send("Sorry, " + msgContent + " is wrong! Please try again." );
            }
            else{
                const currentScore = await driver.findElement(webdriver.By.className("currentScore")).getText();
                message.channel.send("Correct! You've reached " + currentScore + " .");
            }
        }
    }
});



