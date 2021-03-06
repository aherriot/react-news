'use strict';

import React from 'react';


const ResponseArea = React.createClass({
  propTypes: {
    isCorrect: React.PropTypes.bool.isRequired,
    response: React.PropTypes.string.isRequired,
    correctAnswer: React.PropTypes.string.isRequired,
    thirdSide: React.PropTypes.string.isRequired,
    onNext: React.PropTypes.func.isRequired
  },
  componentDidMount() {
    let nextLink = React.findDOMNode(this.refs.nextLink);
    if(nextLink) {
      nextLink.focus();
    }
  },
  onMistype() {

  },
  render() {
    let content;

    if(this.props.isCorrect) {
      content = (
        <div>
          Correct! {this.props.response}
        </div>
      );
    } else {
      content = (
        <div>
          <a href="#" className="right" onClick={this.onMistype}>I Mistyped</a>
          <div>
            <span>Response: </span>
            <span className="red">{this.props.response}</span>
          </div>
          <div>
            <span>Answer: </span>
            <span className="green">{this.props.correctAnswer}</span>&nbsp;
            <span className="">({this.props.thirdSide})</span>
          </div>
        </div>
      );
    }

    return (
      <div className="answerArea">
        {content}
        <div>
          <a href="#" className="btn green right" ref="nextLink" onClick={this.props.onNext}>Next</a>
        </div>
      </div>
    );
  }

});

export default ResponseArea;
