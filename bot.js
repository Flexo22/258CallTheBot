'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
    say(sessionId, context, message, cb) {
        console.log(message);

        // Bot testing mode, run cb() and return
        if (require.main === module) {
            cb();
            return;
        }

        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to from context
        // TODO: need to get Facebook user name
        const recipientId = context._fbid_;
        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to her.
            FB.fbMessage(recipientId, message, (err, data) => {
                if (err) {
                    console.log(
                      'Oops! An error occurred while forwarding the response to',
                      recipientId,
                      ':',
                      err
                    );
                }

                // Let's give the wheel back to our bot
                cb();
            });
        } else {
            console.log('Oops! Couldn\'t find user in context:', context);
            // Giving the wheel back to our bot
            cb();
        }
    },
    merge(sessionId, context, entities, message, cb) {
        // Retrieve the location entity and store it into a context field
        const info = firstEntityValue(entities, 'search_query');
        console.log('merge');
        if (info) {
            context.info = info; // store it in context
        }

        cb(context);
    },

    error(sessionId, context, error) {
        console.log(error.message);
    },

    // getInformation bot executes
    ['getInformation'](sessionId, context, cb) {
      // Here should go the api call, e.g.:
      // context.forecast = apiCall(context.loc)
      //const searchQuery = firstEntityValue(entities, 'search_query')
        //console.log(context.info);

      //change method to use search_query - meanwhile hardcoded
      var search_query = 'sex';
      var queryUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=5&exlimit=max&gsrsearch=" + search_query;

      var request = require('request');
      request(queryUrl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              try {
                  body = JSON.parse(body);
                  var pages = body.query.pages;
                  var text;
                  for (var i in pages) {
                      text = pages[i].extract;
                      text = formatmsg(JSON.stringify(text));
                      context.information = text;
                      cb(context);
                      return;
                  }
              }
              catch (err) {
                  console.log("error : " + err.message);
              }
              cb(context);
          } else {
              cb(error || response.statusCode);
          }
      });
  }
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}

function formatmsg(msg){
    msg = msg.substr(0,320);
    if(msg.lastIndexOf(".") == -1) {
        return msg;
    }
    return msg.substr(0,msg.lastIndexOf(".")+1);
}