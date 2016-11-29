'use strict';

let Wit = null;
let interactive = null;
const Config = require('./const.js');
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

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

//formats the given message
function formatmsg(msg) {
    msg = msg.substr(0, 320);
    if (msg.lastIndexOf(".") === -1) {
        return msg;
    }
    return msg.substr(0, msg.lastIndexOf(".") + 1);
}

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
    
    // getInformation bot executes
    getInformation({context,entities}) {
        return new Promise(function(resolve,reject){

            var search_query = firstEntityValue(entities,"search_query");
            if (search_query){
                var queryUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=1&prop=extracts&exintro&explaintext&exsentences=5&exlimit=max&gsrsearch=" + search_query;

                var request = require("request");
                request(queryUrl, function (error, response, body) {
                    //statusCode 200 = "OK"
                    if (!error && response.statusCode === 200) {
                        try {
                            body = JSON.parse(body);
                            var pages = body.query.pages;
                            var pageId = Object.keys(pages)[0];
                            var text = pages[pageId].extract;
                            context.information = formatmsg(text);
                        }
                        catch (err) {
                            context.information = "Sorry I didn't get that, can you modify your question?";
                        }
                    } else {
                        context.information = "Connection Error: "+ response.statusCode;
                    }
                    return resolve(context);
                });
            } else {
              context.information = "search_query not found";
            }
        });
    }
}

const accessToken = Config.WIT_TOKEN;

const client = new Wit({accessToken, actions});

interactive(client);