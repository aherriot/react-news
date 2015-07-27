'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import { firebaseUrl } from '../util/constants';

const baseRef = new Firebase(firebaseUrl);
//const wordsRef = baseRef.child('words');
const usersRef = baseRef.child('users');

// used to create email hash for gravatar
const hash = require('crypto').createHash('md5');

const Actions = Reflux.createActions({
  // user actions
  'login': {},
  'logout': {},
  'register': {},

  //Word Actions
  'addWord': {asyncResult: true},
  'deleteWord': {},
  'updateWord': {},
  'editWord': {},


  //Quiz Actions



  // firebase actions
  'watchProfile': {},
  'stopWatchingProfile': {},

  'watchWords': {},
  'stopWatchingWords': {},

  // modal actions
  'showModal': {},
  'hideModal': {},
  'modalError': {}
});

/* User Actions
=============================== */

Actions.login.listen(function(loginData) {
  baseRef.authWithPassword(loginData, error => (
    error ? Actions.modalError(error.code) : Actions.hideModal()
  ));
});

function createUser(username, loginData) {
  let profile = {
    username: username,
    md5hash: hash.update(loginData.email).digest('hex'),
    upvoted: {}
  };

  baseRef.createUser(loginData, function(error, userData) {
    if (error) {
      // email taken, other login errors
      return Actions.modalError(error.code);
    }

    // user successfully created
    // add user profile then log them in
    usersRef.child(userData.uid).set(profile, err => err || Actions.login(loginData));
  });
}

Actions.register.listen(function(username, loginData) {
  // check if username is already taken
  usersRef.orderByChild('username').equalTo(username).once('value', function(user) {
    if (user.val()) {
      // username is taken
      Actions.modalError('USERNAME_TAKEN');
    } else {
      // username is available
      createUser(username, loginData);
    }
  });
});

export default Actions;
