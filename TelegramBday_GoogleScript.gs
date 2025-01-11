var token = "xxxxxx"; // Replace with your bot's token
var telegramUrl = "https://api.telegram.org/bot" + token;
var webApp = "xxxx"; // Replace with your Google Apps Script Web App URL
var adminID = "xxxx"; // Replace with your admin's Telegram ID

function getMe(){
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url)
  Logger.log(response.getContentText());
}

function setWebhook(){
  var url = telegramUrl + "/setWebhook?url="+webApp;
  var response = UrlFetchApp.fetch(url)
  Logger.log(response.getContentText());
}

function doGet(e){
  return HtmlService.createHtmlOutput("Hi there!");
}

function sendMessageToTelegram() {
  var message = "Hello from Google Apps Script!"; // Replace with your message
  var telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  var payload = {
    chat_id: adminID,
    text: message
  };
  
  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(telegramUrl, options);
}

//Above this line is configuring the link between telegram app and Google Sheet

function main() {
  // Load the sheet that contains the birthdays.
  var sheet = SpreadsheetApp.getActive().getSheetByName("Birthdays");

  // Get the last row in the sheet that has data.
  var numRows = sheet.getLastRow();

  // Load data in the first two columns from the second row till the last row. 
  // Remember: The first row has column headers so we don’t want to load it.
  var range = sheet.getRange(2, 1, numRows - 1, 5).getValues();

  // Use a for loop to process each row of data
  for(var index in range) {

    // For each row, get the person’s details.
    var row = range[index];
    var name = row[0];
    var notificationDay = row[3];
    var birthday = row[2];
    var groupname =row[1];

    // Check if the person’s birthday is today
    if(isBirthdayToday(notificationDay)) {
      
      //If yes, send an email reminder
      //emailReminder(name, birthday, groupname);

      //If yes, send telegram bot updates
      telegramUpdate(adminID,name,birthday,groupname);
    }
  }
}

// Check if a person’s birthday is today
function isBirthdayToday(notificationDay) {
  
  // If birthday is a string, convert it to date
  if(typeof notificationDay === "string")
    notificationDay = new Date(notificationDay);

  var today = new Date();
  if((today.getDate() === notificationDay.getDate()) &&
      (today.getMonth() === notificationDay.getMonth())) {
    return true;
  } else {
    return false;
  }
}

  // Function to send telegram bot reminder
function telegramUpdate(adminID,name,birthday,groupname){
  //var body = "It is " + name + "'s birthday this week.%0A" + "Actual Birthday falls on the " + birthday.getDate() + " of this month. %0A" + name + " is in group-" +groupname;
  var body = name + "'s birthday from " + groupname + " falls on " + birthday.getDate() + " this week.";
  var url = telegramUrl + "/sendMessage?chat_id="+adminID + "&text=" + body; 
  var response = UrlFetchApp.fetch(url)
  Logger.log(response.getContentText());
}
/*
// Function to send the email reminder
function emailReminder(name, birthday, groupname) {
  var subject = "Birthday reminder: " + name;
  var recipient = "xxxxx"; //recipient email here
  var body = "It is " + name + "'s birthday this week.<br />"+ "Actual Birthday falls on the " + birthday.getDate() + ".\n\n" + name + " is in group-" +groupname;
  MailApp.sendEmail(recipient, subject, body);
}
*/
