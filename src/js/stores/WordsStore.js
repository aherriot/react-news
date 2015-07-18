'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let wordsRef = baseRef.child('words');

let data = {
  words: []
};

const WordsStore = Reflux.createStore({

  listenables: Actions,

  watchWords() {
    wordsRef
      .on('value', this.updateWords);
  },

  stopWatchingWords() {
    wordsRef.off();
  },

  updateWords(wordData) {

    // add words to new array
    let newWords = [];

    wordData.forEach(wordDataItem => {
      let word = wordDataItem.val();
      word.id = wordDataItem.key();
      newWords.unshift(word);
    });

    data.words = newWords;

    this.trigger(data);
  },

  addWord(newWord) {
    console.log('add:', newWord);
    wordsRef.push(newWord);
  },

  deleteWord(word) {
    wordsRef.child(word.id).remove();
  },
  updateWord(word) {
    let id = word.id;
    delete word.id;
    wordsRef.child(id).update(word);
  },

  getDefaultData() {
    return data;
  }

});

export default WordsStore;
