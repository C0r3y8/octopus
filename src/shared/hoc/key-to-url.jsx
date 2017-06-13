import React from 'react';

import { jsperfForEach } from '../utils/jsperf';

/* eslint-disable no-param-reassign */
export default (keys, routeDesc) =>
  Component =>
    (props) => {
      const urls = {};

      if (typeof keys === 'string') {
        urls[ keys ] = routeDesc.url(props[ keys ]);
      } else if (Array.isArray(keys)) {
        keys.jsperfForEach = jsperfForEach;
        keys.jsperfForEach((key) => {
          urls[ key ] = routeDesc.url(key);
        });
      }

      return <Component {...props} {...urls} />;
    };
/* eslint-enable */
