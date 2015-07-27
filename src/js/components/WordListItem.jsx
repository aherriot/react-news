'use strict';

import React from 'react/addons';
import Actions from '../actions/Actions';

const WordListItem = React.createClass({

  propTypes: {
    word: React.PropTypes.object.isRequired
  },

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      english: this.props.word.english,
      persian: this.props.word.persian,
      phonetic: this.props.word.phonetic,
      tags: this.props.word.tags.join(','),
      isEditing: false
    };
  },
  componentWillReceiveProps(){
    this.setState({isEditing: false});
  },
  onDelete(e) {
    e.preventDefault();
    Actions.deleteWord(this.props.word);
  },
  onEdit(e) {
    e.preventDefault();
    // Actions.editWord(this.props.word);
    this.setState({isEditing: true});
  },
  onSave(e) {
    e.preventDefault();
    let updatedWord = this.props.word;
    // let id = updatedWord.id
    updatedWord.english = this.state.english;
    updatedWord.persian = this.state.persian;
    updatedWord.phonetic = this.state.phonetic;
    updatedWord.tags = this.state.tags;

    Actions.updateWord(updatedWord);
  },
  onRevert(e) {
    e.preventDefault();
    // Actions.revertEditWord(this.props.word);
    this.setState({isEditing: false});

  },
  render() {
    let english, persian, phonetic, tags, buttons;
    // if(this.props.word.isEditing) {
    if(this.state.isEditing) {
      english = (<input type="text" placeholder="english" valueLink={this.linkState('english')} />);
      persian = (<input type="text" placeholder="persian" valueLink={this.linkState('persian')} />);
      phonetic = (<input type="text" placeholder="phonetic" valueLink={this.linkState('phonetic')} />);
      tags = (<input type="text" placeholder="tags" valueLink={this.linkState('tags')} />);
      buttons = (
				<div className="right">
					<a href="#" onClick={this.onSave} alt="Save" className="save">save</a>
					&nbsp;
					<a href="#" onClick={this.onRevert} alt="Revert" className="revert">revert</a>
				</div>
			);

    } else {

      english = <span className="english">{this.props.word.english}</span>;
      persian = <span className="persian">{this.props.word.persian}</span>;
      phonetic = <span className="phonetic valign">{this.props.word.phonetic}</span>;
      tags = <span className="tags valign">{this.props.word.tags.join(',')}</span>;

      buttons = (
				<div className="col">
					<a href="#" onClick={this.onEdit} alt="Edit" className="edit">edit</a>
					&nbsp;
					<a href="#" onClick={this.onDelete} alt="Delete" className="delete">delete</a>
				</div>
			);
    }

    return (
			<div className="row">
				<div className="col">{persian}</div> |
				<div className="col">{english}</div> |
				<div className="col s12 m4 l3">{phonetic}</div> |
        <div className="col s6 m4 l2">{tags}</div> |
				<div className="col">{buttons}</div>
			</div>
		);
  }

});

module.exports = WordListItem;
