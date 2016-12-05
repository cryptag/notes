// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import React, { Component } from 'react';
import { render } from 'react-dom';

import App from './app/App';

render(<App/>, document.getElementById('root'));
