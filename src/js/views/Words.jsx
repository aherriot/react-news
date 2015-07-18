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
    let english = React.findDOMNode(this.refs.english).value;
    let persian = React.findDOMNode(this.refs.persian).value;
    Actions.addWord({english: english, persian: persian, creatorUID: this.state.user.uid});
  },


  render() {
    //let user = this.state.user;
    let words = this.state.words;

    words = words.map(function(word) {
      return <WordListItem key={word.id} word={word}/>;
    });

    return (
      <div className="content full-width">
        <hr />
        <div className="words">
          { this.state.loading ? <Spinner /> : words }
        </div>
        <div>
          <form onSubmit={this.addWord}>
            <input ref="english" type="text" placeholder="english" />
            <input ref="persian" type="text" placeholder="persian" />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    );
  }

});

export default Words;
