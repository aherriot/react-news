'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { Navigation, TransitionHook } from 'react-router';

import WordsStore from '../stores/WordsStore';
import UserStore from '../stores/UserStore';

import WordListItem from '../components/WordListItem';
import Spinner from '../components/Spinner';
//import Link from 'react-router/lib/Link';

const Words = React.createClass({

  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [
    TransitionHook,
    Navigation,
    Reflux.listenTo(WordsStore, 'onStoreUpdate'),
    Reflux.connect(UserStore, 'user')
  ],

  getInitialState() {
    let wordsData = WordsStore.getDefaultData();
    return {
      user: UserStore.getDefaultData(),
      loading: true,
      words: wordsData.words
    };
  },

  componentDidMount() {
    Actions.watchWords();
  },

  routerWillLeave() {
    Actions.stopWatchingWords();
  },

  onStoreUpdate(wordsData) {

    this.setState({
      loading: false,
      words: wordsData.words
    });
  },
  addWord(e) {
    e.preventDefault();
    let english = React.findDOMNode(this.refs.english);
    let persian = React.findDOMNode(this.refs.persian);
    let phonetic = React.findDOMNode(this.refs.phonetic);
    let tags = React.findDOMNode(this.refs.tags);

    Actions.addWord({
      english: english.value,
      persian: persian.value,
      phonetic: phonetic.value,
      tags: tags.value,
      creatorUID: this.state.user.uid});

    english.value = '';
    persian.value = '';
    phonetic.value = '';
    tags.value = '';
  },


  render() {
    let user = this.state.user;
    let words = this.state.words;
    let content;

    if(user.isLoggedIn) {
      words = words.map(function(word) {
        return <WordListItem key={word.id} word={word}/>;
      });

      content = (
        <div>
          <h1>Words</h1>
          <div className="words">
            { this.state.loading ? <Spinner /> : words }
          </div>
          <div>
            <form onSubmit={this.addWord}>
              <input ref="persian" type="text" placeholder="Persian" />
              <input ref="english" type="text" placeholder="English" />
              <input ref="phonetic" type="text" placeholder="Phonetic" />
              <input ref="tags" type="text" placeholder="Tags" />

              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      );
    } else { //not logged in
      content = (
        <div>
          Login to view your word list, or sign up to create an account.
        </div>
      );
    }

    return (
      <div className="content full-width">
        {content}
      </div>
    );

  }

});

export default Words;
