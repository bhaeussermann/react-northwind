import React from 'react';
import './Common.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

const Spinner = props => {
  return (<div className={'spinner' + (props.inline ? ' inline-spinner' : '')}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>);
}

const timeout = (promise, timeoutDuration) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);

    promise
      .then(resolve)
      .catch(reject);
  });
}

const resolveResponse = async responsePromise => {
  const response = await responsePromise;
  if (response.status >= 400)
    throw Error(response.statusText);

  return response;
}

const parseResponseAsJson = async responsePromise => {
  const response = await resolveResponse(responsePromise);
  return await response.json();
}

const Common = {
  Spinner,
  timeout,
  resolveResponse,
  parseResponseAsJson
};

export default Common;
