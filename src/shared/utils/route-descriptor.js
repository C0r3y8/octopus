import pathToRegexp from 'path-to-regexp';
import warning from 'warning';

import { check } from 'meteor/check';

/** @class */
export default class RouteDescriptor {
  /** @constructor */
  constructor() {
    this.namespaces = {};
    this.routes = {};
  }

  /**
   * @summary Adds route
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
   * @method add
   * @param {string} key
   * @param {string} path
   * @param {object=} config
   * @param {array.<function>} callback
   */
  add(key, path, config = {}, ...callback) {
    check(key, String);
    check(path, String);

    warning(!this.routes[ key ], 'Route already exist');
    this.routes[ key ] = {
      callback,
      compiled: pathToRegexp.compile(path),
      config,
      url: path
    };
  }

  /**
   * @summary Gets route
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
   * @method get
   * @param {string} key
   * @return {object}
   */
  get(key) {
    check(key, String);

    const keys = key.split('.');
    const name = keys.shift();

    if (keys.length > 0) {
      return this.namespaces[ name ].get(keys.join('.'));
    }

    return {
      callback: this.routes[ name ].callback,
      config: this.routes[ name ].config,
      url: this.routes[ name ].url
    };
  }

  /**
   * @summary Returns all routes
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
   * @method getRoutes
   * @return {array}
   */
  getRoutes() {
    const namespaces = this.namespaces.map(key => this.namespaces[ key ].all());
    const routes = this.routes.map(key => this.get(key));

    return namespaces.concat(routes).sort((a, b) => a.url.localeCompare(b.url));
  }

  /**
   * @summary Gets multiple routes
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
   * @method mget
   * @param {array} keys
   * @return {array}
   */
  mget(keys) {
    check(keys, Array);

    return keys.map(key => this.get(key));
  }

  /**
   * @summary Creates namespace and adds nested routes
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
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

  /**
   * @summary Returns route url for key `key`
   * @locus Anywhere
   * @instance
   * @memberof RouteDescriptor
   * @method url
   * @param  {string} key
   * @param  {object=} params
   * @param  {object=} options
   * @return {string}
   */
  url(key, params = undefined, options = undefined) {
    check(key, String);

    const keys = key.split('.');
    const name = keys.shift();

    if (keys.length > 0) {
      return this.namespaces[ name ].url(keys.join('.'), params, options);
    } else if (params || options) {
      return this.routes[ name ].compiled(params, options);
    }
    return this.routes[ name ].path;
  }
}

/** @class */
class RouteNamespace extends RouteDescriptor {
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
   * @param {string} key
   * @param {string} path
   * @param {object=} config
   * @param {array.<function>} callback
   */
  add(key, path, config = {}, ...callback) {
    const prefixed = this.prefix + path;

    super.add(key, prefixed, config, ...callback);
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
    const prefixed = this.prefix + path;

    super.namespace(key, prefixed, nestedRoutes);
  }
}
