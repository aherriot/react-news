'use strict';

import React from 'react/addons';

// components
const Link = require('react-router').Link;

const uhOh = React.createClass({
  render() {
    return (
      <div className="content full-width">
        <h1>{ 'That Page Doesn\'t Exist' }</h1>
        <p><Link to="/">Return to the homepage</Link></p>
        <p><Link to="/words">Go to Words</Link></p>
      </div>
    );
  }
});

export default uhOh;
