import pathToRegexp from 'path-to-regexp';
import warning from 'warning';

import { check } from 'meteor/check';

/** @class */
export default class RoutesHelper {
  /** @constructor */
  constructor() {
    this.namespaces = {};
    this.routes = {};
  }

  /**
   * @summary Adds route
   * @locus Anywhere
   * @instance
   * @memberof RoutesHelper
   * @method add
   * @param {object} config
   * @param {string} config.key
   * @param {string} config.path
   */
  add(key, path) {
    check(key, String);
    check(path, String);

    warning(!this.routes[ key ], 'Route already exist');
    this.routes[ key ] = {
      compiled: pathToRegexp.compile(path),
      path
    };
  }

  /**
   * @summary Returns route path for key `key`
   * @locus Anywhere
   * @instance
   * @memberof RoutesHelper
   * @method get
   * @param  {string} key
   * @param  {object=} params
   * @param  {object=} options
   * @return {string}
   */
  get(key, params = undefined, options = undefined) {
    check(key, String);

    const keys = key.split('.');
    const name = keys.shift();

    if (keys.length > 0) {
      return this.namespaces[ name ].get(keys.join('.'), params, options);
    } else if (params || options) {
      return this.routes[ name ].compiled(params, options);
    }
    return this.routes[ name ].path;
  }

  /**
   * @summary Creates namespace and adds nested routes
   * @locus Anywhere
   * @instance
   * @memberof RoutesHelper
   * @method namespace
   * @param  {string} key
   * @param  {string} path
   * @param  {function} nestedRoutes
   */
  namespace(key, path, nestedRoutes) {
    check(key, String);
    check(path, String);
    check(nestedRoutes, Function);

    warning(!this.namespaces[ key ], 'Namespace already exist');
    // eslint-disable-next-line no-use-before-define
    this.namespaces[ key ] = new RouteNamespace(path);
    nestedRoutes.call(this.namespaces[ key ]);
  }
}

/** @class */
class RouteNamespace extends RoutesHelper {
  /**
   * @constructor
   * @param  {string} prefix
   */
  constructor(prefix) {
    check(prefix, String);

    super();
    this.prefix = prefix;
  }

  /**
   * @summary Adds route
   * @locus Anywhere
   * @instance
   * @memberof RouteNamespace
   * @method add
   * @param  {string} key
   * @param  {string} path
   */
  add(key, path) {
    check(key, String);
    check(path, String);

    const prefixed = this.prefix + path;

    warning(!this.routes[ key ], 'Route already exist');
    this.routes[ key ] = {
      compiled: pathToRegexp.compile(prefixed),
      path: prefixed
    };
  }

  /**
   * @summary Creates namespace and adds nested routes
   * @locus Anywhere
   * @instance
   * @memberof RouteNamespace
   * @method namespace
   * @param  {string} key
   * @param  {string} path
   * @param  {function} nestedRoutes
   */
  namespace(key, path, nestedRoutes) {
    check(key, String);
    check(path, String);
    check(nestedRoutes, Function);

    const prefixed = this.prefix + path;

    warning(!this.namespaces[ key ], 'Namespace already exist');
    // eslint-disable-next-line no-use-before-define
    this.namespaces[ key ] = new RouteNamespace(prefixed);
    nestedRoutes.call(this.namespaces[ key ]);
  }
}
