import React from 'react';

/* eslint-disable no-param-reassign */
export default Component =>
  (props, { router }) => {
    if (Meteor.isServer) {
      router.staticContext.notFound = true;
    }

    return <Component {...props} />;
  };
/* eslint-enable */
