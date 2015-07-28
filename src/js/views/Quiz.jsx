'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { Navigation, TransitionHook } from 'react-router';

import randElement from '../util/util';

import WordsStore from '../stores/WordsStore';
import UserStore from '../stores/UserStore';

import ResponseArea from '../components/quiz/ResponseArea';
import ResultsArea from '../components/quiz/ResultsArea';

import MAX_RECENT_WRONG from '../util/constants';



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
      words: wordsData.words,

      srcLang: 'english',
      destLang: 'phonetic',
      otherLang: 'persian',

      response: '', //answer from user
      selfEvaluation: false, // are answered typed in, or self evaluated?

      isMarking: false, // are we asking a question, or marking answer
      isCorrect: true, // was response correct

      word: null,
      previousWord: null, //the previous wrong, so its not asked twice in a row
      recentWrong: [] //a list of recently answered wrong words

    };
  },

  componentDidMount() {
    Actions.watchWords();
  },

  routerWillLeave() {
    Actions.stopWatchingWords();
  },

  onStoreUpdate(wordsData) {

    if(wordsData.words.length > 0) {
      this.setState({
        words: wordsData.words,
        word: randElement(wordsData.words)
      });
    }
  },

  selectWord() {
    console.log('recentWrong: ' + this.state.recentWrong.map((e) => e.english) + ', previous: ' + this.state.word.english);
    let nextWord = null;

    while(nextWord == null || (this.state.word && nextWord && this.state.word.id === nextWord.id)) {

      if(this.state.recentWrong.length >= MAX_RECENT_WRONG) {
        nextWord = randElement(this.state.recentWrong);
      } else {
        nextWord = randElement(this.state.words);
      }
    }

    return nextWord;
  },

  onSubmitResponse(response) {

    var correctAnswer = this.state.word[this.state.destLang];

    if(response === correctAnswer) {
      this.onCorrect(response);
    } else {
      this.onWrong(response);
    }
  },

  onCorrect(response) {
    var recentWrong = this.state.recentWrong.filter(function(word) {
      return this.state.word.id !== word.id;
    }, this);

    this.setState({
      response: response,
      recentWrong: recentWrong,
      isMarking: true,
      isCorrect: true
    });
  },
  onWrong(response) {
    var inRecentWrong = false;

    //check if in recent wrong list
    this.state.recentWrong.forEach(function(word) {
      if(this.state.word.id === word.id) {
        inRecentWrong = true;
      }
    }, this);


    var recentWrong = this.state.recentWrong.slice();

    //add if it is not there already.
    if(!inRecentWrong) {
      recentWrong.push(this.state.word);
    }

    this.setState({
      response: response,
      recentWrong: recentWrong,
      isMarking: true,
      isCorrect: false
    });
  },

  onNext(e) {

    e.preventDefault();

    let nextWord = this.selectWord();

    this.setState({
      isMarking: false,
      response: '',
      word: nextWord,
      previousWord: this.state.word
    });

  },

  render() {
    let user = this.state.user;
    let content;
    let word = this.state.word ? this.state.word[this.state.srcLang] : '';

    if(!user.isLoggedIn) {
      return (
        <div className="content full-width">
          Login to view the quiz.
        </div>
      )
    }

    if(this.state.isMarking) {
      content = (<ResultsArea
        word={word}
        response={this.state.response}
        correctAnswer={this.state.word[this.state.destLang]}
        thirdSide={this.state.word[this.state.otherLang]}
        isCorrect={this.state.isCorrect}
        onNext={this.onNext}/>);
    } else {
      content = (<ResponseArea onSubmitResponse={this.onSubmitResponse}/>);
    }

    return (
      <div className="content full-width">
        <h1>Quiz</h1>

        <div className="row">
          <div className="col offset-s0 s12 offset-m1 m10 offset-l2 l8">
            <div className="card">
              <div className="card-content">
                <span className="">{word}</span>
                <div className="right">
                  <a href="#" className="" onClick={this.onEdit}>Edit</a>&nbsp;|&nbsp;
                  <a href="#" className="" onClick={this.onDisplayOptions}>Options</a>
                </div>
                <hr/>
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );


  }

});

export default Words;
