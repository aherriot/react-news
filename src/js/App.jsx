/*
Project:  react-news
Author:   Evan Henley
Author URI: http://henleyedition.com/
====================================== */

'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import { Router, Route, Redirect } from 'react-router';
import HashHistory from 'react-router/lib/HashHistory';
import Link from 'react-router/lib/Link';

import Actions from './actions/Actions';

import UserStore from './stores/UserStore';
import ModalStore from './stores/ModalStore';

import Words from './views/Words';
import Quiz from './views/Quiz';
import Profile from './views/Profile';
import UhOh from './views/404';
import Login from './components/Login';
import Register from './components/Register';

import cx from 'classnames';

let App = React.createClass({

  propTypes: {
    children: React.PropTypes.object
  },

  mixins: [
    Reflux.listenTo(UserStore, 'onStoreUpdate'),
    Reflux.listenTo(ModalStore, 'onModalUpdate')
  ],

  getInitialState() {
    return {
      user: UserStore.getDefaultData(),
      modal: ModalStore.getDefaultData()
    };
  },

  onStoreUpdate(user) {
    this.setState({
      user: user,
      showModal: false
    });
  },

  onModalUpdate(newModalState) {
    let oldModalState = this.state.modal;

    function onKeyUp(e) {
      // esc key closes modal
      if (e.keyCode === 27) {
        Actions.hideModal();
      }
    }

    // pressing esc closes modal
    if (!oldModalState.show && newModalState.show) {
      window.addEventListener('keyup', onKeyUp);
    } else if (oldModalState.show && !newModalState.show) {
      window.removeEventListener('keyup', onKeyUp);
    }

    this.setState({
      modal: newModalState
    });
  },

  hideModal(e) {
    e.preventDefault();
    Actions.hideModal();
  },

  render() {
    let user = this.state.user;
    let modal = this.state.modal;

    let username = user ? user.profile.username : '';
    let md5hash = user ? user.profile.md5hash : '';
    let gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

    let wrapperCx = cx(
      'wrapper',
      'full-height', {
      'modal-open': modal.show
    });

    let modalComponent;

    switch (modal.type) {
      case 'register':
      modalComponent = <Register errorMessage={ modal.errorMessage } />; break;
      case 'login':
      modalComponent = <Login errorMessage={ modal.errorMessage } />; break;
      case 'newpost':
      modalComponent = <NewPost errorMessage={ modal.errorMessage } user={ user } />;
    }

    let userArea = user.isLoggedIn ? (
      // show profile info
      <span className="user-info">
      <Link to={ `/user/${username}` } className="profile-link">
        <span className="username">{ username }</span>
        <img src={ gravatarURI } className="profile-pic" />
      </Link>
      </span>
    ) : (
      // show login/register
      <span>
      <a onClick={ () => Actions.showModal('login') }>Sign In</a>
      <a onClick={ () => Actions.showModal('register') } className="register-link">Register</a>
      </span>
    );

    return (
      <div className={ wrapperCx }>
      <header className="header cf">
        <div className="float-left">
        <Link to="/" className="menu-title">Flashcards</Link>
        <Link to="/quiz" className="menu-title">Quiz</Link>
        <Link to="/words" className="menu-title">Words</Link>

        </div>
        <div className="float-right">
        { userArea }
        </div>
      </header>

      <main id="content" className="full-height inner">
        { this.props.children }
      </main>

      <aside className="md-modal">
        <a href="#" onClick={ this.hideModal } className="md-close">
        <span className="fa fa-close"></span>
        <span className="sr-only">Hide Modal</span>
        </a>
        { modalComponent }
      </aside>
      <a href="#" className="md-mask" onClick={ this.hideModal }></a>
      </div>
    );
  }
});

React.render((
  <Router history={ new HashHistory() }>
  <Route component={ App }>
    <Route name="home" path="/" component={ Words } />
    <Route name="words" path="/words" component={ Words } />
    <Route name="quiz" path="/quiz" component={ Quiz } />
    <Route name="profile" path="/user/:username" component={ Profile } />
    <Route path="*" component={ UhOh } />

    {/* Redirects */}
    <Redirect from="/" to="/words" />

  </Route>
  </Router>
), document.getElementById('app'));
