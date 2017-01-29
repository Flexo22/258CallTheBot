'use strict';

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "just_do_it";
}

const FB_USER_TOKEN = process.env.FB_USER_TOKEN;
const FB_USER_TOKEN_FLAG = process.env.FB_USER_TOKEN_FLAG;

const FB_APP_SECRET = process.env.FB_APP_SECRET;

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  FB_APP_SECRET: FB_APP_SECRET,
  FB_USER_TOKEN: FB_USER_TOKEN,
  FB_USER_TOKEN_FLAG : FB_USER_TOKEN_FLAG,
};