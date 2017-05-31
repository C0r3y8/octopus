Package.describe({
  name: 'c0r3y8:octopus',
  version: '0.2.1',
  // Brief, one-line summary of the package.
  summary: 'Router that enables SSR for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/C0r3y8/octopus.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

const basePackages = {
  all: [
    'accounts-base',
    'check',
    'ecmascript',
    'ejson',
    'meteor',
    'meteorhacks:meteorx@1.4.1',
    'minimongo',
    'mongo-id',
    'routepolicy',
    'tmeasday:check-npm-versions@0.3.1'
  ],
  server: [
    'ddp',
    'random',
    'webapp'
  ]
};

const testPackages = [
  'http',
  'practicalmeteor:mocha',
  'practicalmeteor:mocha-console-runner',
  'practicalmeteor:chai',
  'practicalmeteor:sinon',
  'react-meteor-data'
];

/* eslint-disable func-names, prefer-arrow-callback */
Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');

  Npm.depends({
    assert: '1.4.1',
    'connect-redirection': '0.0.1',
    'path-to-regexp': '1.7.0',
    warning: '3.0.0'
  });

  api.use(basePackages.all);
  api.use(basePackages.server, 'server');

  api.mainModule('client/index.js', 'client');
  api.mainModule('server/index.js', 'server');
});
/* eslint-enable */

/* eslint-disable func-names, prefer-arrow-callback */
Package.onTest(function (api) {
  Npm.depends({
    assert: '1.4.1',
    'chai-webdriver-promised': '4.0.3',
    'connect-redirection': '0.0.1',
    faker: '4.1.0',
    'path-to-regexp': '1.7.0',
    'selenium-webdriver': '2.53.3',
    warning: '3.0.0'
  });
  api.use(basePackages.all);
  api.use(basePackages.server, 'server');

  api.use(testPackages);

  api.addFiles('client/index.js', 'client');
  api.addFiles('server/index.js', 'server');

  api.addFiles('server/router-tests.jsx', 'server');
});
/* eslint-enable */
