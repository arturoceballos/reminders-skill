var alexa = require('alexa-app');
var http = require('http');
var app = new alexa.app();

/**
 * LaunchRequest.
 */
app.launch(function(request,response) {
  var greeting = "Welcome to reminders. You can ask me to remind you to do things by saying something like, Jeeves, remind me to make dinner at six pm.";
  var card = {
    type: "Simple",
    title: "Reminders",
    content: greeting
  };
	response.say(greeting);
	response.card(card.title, card.content);
  response.shouldEndSession(false);
});


/**
 * IntentRequest.
 */
app.intent('ScheduleReminderIntent',
  {
    'slots':{
      'REMINDER':'LIST_OF_REMINDERS',
      'DATE': 'AMAZON.DATE',
      'TIME': 'AMAZON.TIME'
    },
    'utterances':[
      'remind me to {REMINDER} on {DATE} at {TIME}',
      'remind me to {REMINDER} {DATE} at {TIME}',
      '{DATE} at {TIME} remind me to {REMINDER}',
      'at {TIME} {DATE} remind me to {REMINDER}'
    ]
  },
  function(request,response) {
    var reminder = request.slot('REMINDER'),
      date = request.slot('DATE'),
      time = request.slot('TIME');
    var sessionAttributes = {
      reminder: reminder,
      date: date,
      time: time
    };
    // TODO: Save the userId, request.slot('DATE'), request.slot('TIME'), request.slot('REMINDER') to mongoDB
    response.say('Very well. I will remind you to ' + reminder + ' on ' + date + ' at ' + time);
    response.card('Reminders', 'Very well. I will remind you to ' + reminder + ' on ' + date + ' at ' + time);
    response.shouldEndSession(false);
    response.send();
  }
);

app.intent('GetReminderIntent',
  {
    'slots': {
      'DATE': 'AMAZON.DATE'
    },
    'utterances':[
      "give me all my reminders for {DATE}",
      "what are my reminders for {DATE}",
      "give me {DATE} reminders",
      "remind me what I'm doing {DATE}",
      "list my to dos for {DATE}",
      "what do I have to do {DATE}"
    ]
  },
  function (request, response) {
    var userId = request.data.session.user.userId;
    var date = request.slot('DATE');
    
    http.get(endpoint, function (res) {
      console.log(res);
    });
  
    response.say('Did you say ' + date + '?');
    response.card('res: ' + res);
    // TODO: Get all the reminders for a specified day
    response.shouldEndSession(false);
    response.send();
  }
);

app.intent('EndSessionIntent',
  {
    'utterances': [
      'stop',
      'end',
      'cancel',
      'cease',
      'you are dismissed',
      'later jeeves'
    ]
  },
  function (request, response) {
    response.shouldEndSession(true);
    response.send();
  });

/**
 * Error handler for any thrown errors.
 */
app.error = function(exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();