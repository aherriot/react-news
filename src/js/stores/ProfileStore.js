'use strict';

import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

import Firebase from 'firebase';

const ref = new Firebase(firebaseUrl);

// store listener references
let postListener, commentListener;

let data = {
  userId: ''
};

const ProfileStore = Reflux.createStore({

  listenables: Actions,

  watchProfile(id) {
    data.userId = id;
  },

  stopWatchingProfile() {
  },



  getDefaultData() {
    return data;
  }
});

export default ProfileStore;
