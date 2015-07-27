'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import { Navigation } from 'react-router';

import Actions from '../actions/Actions';

import ProfileStore from '../stores/ProfileStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';

const Profile = React.createClass({

  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [
    Navigation,
    Reflux.listenTo(ProfileStore, 'updateProfileData'),
    Reflux.listenTo(UserStore, 'updateUser')
  ],

  getInitialState() {
    return {
      user: UserStore.getDefaultData(),
      profileData: ProfileStore.getDefaultData(),
      loading: true
    };
  },

  componentDidMount() {
    let username = this.props.params.username;

    // watch posts/comments for username in url
    UserStore.getUserId(username)
      .then(Actions.watchProfile);
  },

  componentWillReceiveProps(nextProps) {
    let oldUsername = this.props.params.username;
    let newUsername = nextProps.params.username;

    if (oldUsername !== newUsername) {
      this.setState({
        loading: true
      });

      Actions.stopWatchingProfile();
      UserStore.getUserId(newUsername)
        .then(Actions.watchProfile);
    }
  },

  routerWillLeave() {
    Actions.stopWatchingProfile();
  },

  updateUser(updatedUser) {
    if (updatedUser.isLoggedIn) {
      this.setState({
        user: updatedUser
      });
    } else {
      // user has logged out
      this.transitionTo('/');
    }
  },

  updateProfileData(profileData) {
    this.setState({
      profileData: profileData,
      loading: false
    });
  },

  logout(e) {
    e.preventDefault();
    Actions.logout();
  },

  render() {
    let user = this.state.user;
    let profileData = this.state.profileData;
    let posts = profileData.posts;

    let userOptions = user.uid === profileData.userId && (
      <div className="user-options text-right">
        <button
          onClick={ this.logout }
          className="button button-primary"
        >
          Sign Out
        </button>
        <hr />
      </div>
    );

    return (
      <div className="content full-width">
        { userOptions }
        <h1>{ this.props.params.username + '\'s' } Profile</h1>
      </div>
    );
  }

});

export default Profile;
