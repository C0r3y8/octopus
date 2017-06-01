import React from 'react';

/* eslint-disable import/prefer-default-export, no-param-reassign */
export const NotFound = Component =>
  (props, { router }) => {
    if (Meteor.isServer) {
      router.staticContext.notFound = true;
    }

    return <Component {...props} />;
  };
/* eslint-enable */
