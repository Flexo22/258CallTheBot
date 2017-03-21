'use strict';

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const request = require('request');
const Config = require('./const.js');
const https = require('https');

const fbReq = request.defaults({
  uri: 'https://graph.facebook.com/me/messages',
  method: 'POST',
  json: true,
  qs: {
    access_token: Config.FB_PAGE_TOKEN
  },
  headers: {
    'Content-Type': 'application/json'
  },
});

const fbMessage = (recipientId, msg, cb) => {
  const opts = {
    form: {
      recipient: {
        id: recipientId,
      },
      message: {
        text: msg,
      },
    },
  };

  fbReq(opts, (err, resp, data) => {
    if (cb) {
      cb(err || data.error && data.error.message, data);
    }
  });
};

function getData (apiPath,callback) {
    const options = {
        host: 'graph.facebook.com',
        port: 443,
        path: '/v2.8/' + apiPath,
        method: 'GET'
    };

    var buffer = ''; //this buffer will be populated with the chunks of the data received from facebook
    var request = https.get(options, function (result) {
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            buffer += chunk;
        });
        result.on('end', function () {
            return callback(new Promise.resolve(buffer));
        });
    });

    request.on('error', function (e) {
        console.log('error from facebook.getFbData: ' + e.message)
    });

    request.end();
}

// See the Webhook reference
// https://developers.facebook.com/docs/messenger-platform/webhook-reference
const getFirstMessagingEntry = (body) => {
  const val = body.object === 'page' &&
    body.entry &&
    Array.isArray(body.entry) &&
    body.entry.length > 0 &&
    body.entry[0] &&
    body.entry[0].messaging &&
    Array.isArray(body.entry[0].messaging) &&
    body.entry[0].messaging.length > 0 &&
    body.entry[0].messaging[0];

  return val || null;
};

module.exports = {
  getFirstMessagingEntry: getFirstMessagingEntry,
  fbMessage: fbMessage,
  fbReq: fbReq,
  getData : getData,
};