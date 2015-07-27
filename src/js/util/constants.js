'use strict';

const errorMessages = {
  LOGIN_REQUIRED: 'You have to login to do that.',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_PASSWORD: 'Invalid password.',
  INVALID_USER: 'User doesn\'t exist.',
  NO_USERNAME: 'You have to enter a username.',
  EMAIL_TAKEN: 'That email is taken.',
  USERNAME_TAKEN: 'That username is taken.',
  default: 'Something went wrong.'
};

const constants = {
  MAX_RECENT_WRONG: 5,
  errorMessages: errorMessages,
  firebaseUrl: 'https://burning-heat-6329.firebaseio.com/'
};

export default constants;
