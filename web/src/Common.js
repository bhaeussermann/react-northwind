import React from 'react';
import './Common.css';

const Spinner = props => {
  return (<div className="spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>);
}

const timeout = (promise, timeoutDuration) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);

    promise
      .then(resolve)
      .catch(reject);
  });
}

const Common = {
  Spinner: Spinner,
  timeout: timeout
};

export default Common;
