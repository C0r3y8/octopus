import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

import Router from './router';
import RoutesHelper from '../shared/helpers/routes';
import enableLiveDataSupport from './support/pubsub/connection';

import {
  jsperfFilter,
  jsperfFind,
  jsperfForEach
} from '../shared/utils/jsperf';
import {
  decodeData,
  encodeData
} from '../shared/utils/tools';
import { isAppUrl } from '../shared/utils/urls';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
  'react-router-dom': '4.x'
}, 'c0r3y8:octopus');

/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export, func-names, prefer-arrow-callback */
/* eslint-enable max-len */
const Octopus = (App, clientOptions) => {
  const app = new Router({
    App,
    options: clientOptions
  });

  enableLiveDataSupport(app);

  app.initStartup();

  return app;
};

export {
  decodeData,
  encodeData,
  isAppUrl,
  jsperfFilter,
  jsperfFind,
  jsperfForEach,
  Octopus,
  RoutesHelper
};
/* eslint-enable */
