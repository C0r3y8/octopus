# Octopus

```
                          `--::-`                                
                        .+ssssssys:                              
             ./++/-    /ssssssssssyo       -+oo/.                
            -yoshsso  /ssssssssssssy/     /shh-sy.               
            `- .ysyo .sssosssssssosyy`    osyy/.-                
             .oso+-  .ssossysssohooyy`    `ossy:                 
            `ss.      osssysosossosys       +sss`                
             ss+.   `-/sssssyyysssyy+:.    `osss`                
             .osssssyyyyyssssosssyysssss+/+ssss-                 
               ./sssssssssssyssssyysssyyssss+:`                  
                osssyyyysssyyssssyyysssys:.`                     
         ``    /ssyhhyhyssyyyssssyyhhhysy`      .-.`             
       :++osoossyyo::...ossyyssssy+ .ohyss-  .:ssyyy:            
      `:    .:/:-      `ossyyssssyo   -shyyyss+/---:o            
                 :/+//+sssys:`/sssss+++++/```       `            
               .osyyyssoo/.     .:+ssyhyys+.                     
          :/+osyyo.                    ./yyysoos-                
          `                                `   `-                
```

A router that enables __SSR__ (Server Side Rendering) for [Meteor](https://www.meteor.com/).

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Examples](#examples)
4. [API](#api)
5. [RouteDescriptor](#routedescriptor)
6. [HOC](#hoc)
7. [Create a module](#create-a-module)
8. [Create an engine](#create-an-engine)
9. [Sources](#sources)

## Introduction

Basically, I create this package to learn more about [Meteor](https://www.meteor.com/) and __SSR__.

But if this package can help someone, I would be delighted to help.

> By default, Octopus adds support for [`react`](https://github.com/facebook/react) and [`react-router v4`](https://github.com/ReactTraining/react-router/tree/v4) with `ReactRouterEngine` but you can create your own [engine](#create-an-engine) to render what you want on client and server.
Also, you can use [modules](#using-a-module) to add some good stuff like Redux or other.

## Installation

__Atmosphere:__
```bash
$ meteor add c0r3y8:octopus
```

> [Atmosphere page](https://atmospherejs.com/c0r3y8/octopus)

## Examples

Some parts of Octopus API are not be able on both client and server so I try to provide a small example.

> See [ToDo example](https://github.com/C0r3y8/meteor-todos) for more informations

__Both:__
```javascript
// Some imports

const MainApp = () => (
  <div>
    <ul>
      <li><Link to="/">{'Home'}</Link></li>
      <li><Link to="/redux">{'Redux'}</Link></li>
    </ul>

    <Switch>
      <Route exact path="/" component={AppContainer} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

const app = Octopus(MainApp);
```

__Client:__
```javascript
// Do nothing
```

__Server:__
```javascript
app.route({
  exact: true,
  path: '/'
}, function (req, res, next) {
  // Do something
  next();
});
```

## API

> JSDoc 3 is used in this package. In future, I'll deploy the generated doc for more API documentation.

#### `Octopus(MainApp, [clientConfig], [serverConfig])`
> Anywhere

Adds Octopus middleware in [`webapp`](https://github.com/meteor/meteor/tree/devel/packages/webapp).

Returns Octopus instance.

__Arguments__
-  `MainApp` (Function): This is your React app
- [`clientConfig`] (Object): Custom client configuration
  - [`clientConfig.engine=new ReactRouterEngine`] (Object): use this option, if you want to use a custom engine
  - [`clientConfig.engineOptions={}`] (Object): use this option, if you want to pass custom options to the engine like `renderToString`
  - [`clientConfig.startup=true`] (Boolean): if `true`, router starts automatically on `Meteor.startup` but sometimes you need to start router when you want so you can set it to `false` and call `app.render` manually.
- [`serverConfig`] (Object): Custom server configuration
  - [`serverConfig.engine=new ReactRouterEngine`] (Object): use this option, if you want to use a custom engine
  - [`serverConfig.engineOptions={}`] (Object): use this option, if you want to pass custom options to the engine like `renderToString` or `extras` body / headers
  - [`serverConfig.Logger=undefined`] (Object): use this option if you want to enable logs. Logger object needs `log` method with this prototype `log(type, code, ...args)` where `type(String)` ex 'error', 'info', 'verbose', 'debug', `message(String)` and `...args` extra arguments passed by the router
  - [`serverConfig.routeDesc=undefined`] (Object): use this option if you want to user `RouteDescriptor` include in this package

#### `app.middleware(callback [, callback...])`
> Anywhere

Adds middleware callback.

__Arguments__
- `callback` (Function):
  - __On Client:__ Callback is called (`callback()`) without arguments. It's just like a before render hook.
  - __On Server:__ Callback is called (`callback(req, res, next)`) with request, response and next arguments. You can use this to do some checks or to pass custom context to other middleware or route callback by using `this`, ex: `this.store = createStore(...)`.

> If you want to access to middleware context (`this`) in your callback, do not use arrow function.

#### `app.module(Module, [options])`
> Anywhere

Adds module.

__Arguments__
- `Module` (Function|Object): it can be an __instance__ or a __class__ (ES2015), if it's a `function` then call `new Module` else use Module directly
- [`options={}`] (Object):
  - [`options.config`] (Object): if it's set and `Module` is a function then pass `config` as an argument to `new Module(config)`
  - [`options.engineOptions=true`] (Boolean): if `true`, `Module` can set engine options
  - [`options.middlewares=true`] (Boolean): if `true`, `Module` can add middleware
  - [`options.routes=true`] (Boolean): __Server only__, if `true`, `Module` can add route

#### `app.route(routeConfig, callback [, callback...])`
> Server

Adds route.

__Arguments__
- `routeConfig` (Object):
  - [`routeConfig.exact=false`] (Boolean): if `true`, path must be matched exactly with request url
  - `routeConfig.path` (String): an Express-style path
  - [`routeConfig.strict=false`] (Boolean): if `false`, the trailing slash is optional
- `callback` (Function): callback is called if request url matches with a route path. For dynamic route ex: `/user/:name`, you can access to url parameters with `this.params.name`.

> If you want to access to route context (`this`) in your callback, do not use arrow function.

## RouteDescriptor

You have two ways to define routes, you can use `router.route( /* ... */ )` or `RouteDescriptor`.

__When to use it ?__
If you want to define helpers, route middleware and attach some other config to a route in one place.

> It's recommended to use package like `ssrwpo:uglifyjs2` to remove part of your server side code like logic include in your route middleware.

### API

```javascript
import { RouteDescriptor } from 'meteor/c0r3y8:octopus';

export const routeDesc = new RouteDescriptor();
```

#### `routeDesc.add(key, path , [config], [callback] [, callback...])`
> Anywhere

Adds route.

__Arguments__
- `key` (String): use to identify a route ex 'home'
- `path` (String): route path ex '/home'
- [`config={}`] (Object): use to attach some options, this options are passed to the router
- [`callback`] (Function): callback is passed to the router

#### `routeDesc.get(key)`
> Anywhere

Returns object with `callback` (Array), `config` (Object) and `url` (String) properties.

__Arguments__
- `key` (String): key that use with `add` method

#### `routeDesc.getRoutes()`
> Anywhere

Returns all routes.

#### `routeDesc.mget(keys)`
> Anywhere

Returns wanted routes.

__Arguments__
- `keys` (Array): list of `key` (String)

#### `routeDesc.namespace(key, path, nestedRoutes)`
> Anywhere

Creates namespace.

__Arguments__
- `key` (String): use to identify namespace ex 'users'
- `path` (String): base path
- `nestedRoutes` (Function): use to create sub routes

> Do not use arrow function to access to `this`.

#### `routeDesc.url(key, [params], [options])`
> Anywhere

Returns route url.

__Arguments__
- `key` (String): use to find route
- [`params=undefined`] (Object): use to replace url parameters, ex replace `/users/:userId` by `/users/1` with `params = { userId: 1 }`
- [`options=undefined`] (Object): options passed to `path-to-regexp` `compile` method

## HOC

Octopus includes some __HOC__.

### API

#### `keyToUrl(keys, routeDesc)(Component)`
> Anywhere

Changes props `keys` to route url and pass it to `Component`.

Returns pure function.

__Arguments__
- `keys` (String | Array): use to transform `props[ key ]` to url
- `routeDesc` (Object): route descriptor instance
- `Component` (ReactComponent | Function): receive changed props.

__Example__
```javascript
import { Route } from 'react-router-dom';

import { keyToUrl, RouteDescriptor } from 'meteor/c0r3y8:octopus';

const routeDesc = new RouteDescriptor();

routeDesc.add('home', '/home');

routeDesc.namespace('users', '/users', function () {
  this.add('show', '/:userId');
});

const CustomRoute = keyToUrl('path', routeDesc)(Route);

// HOME
/*
  <CustomRoute path="home" />
  equivalent to
  <Route path="/home" />
  */

// USERS
/*
  <CustomRoute path="users.show" />
  equivalent to
  <Route path="/users/:userId" />
 */
```

#### `notFound(Component)`
> Anywhere

On server, set `notFound` to true in react router context.

Returns pure function.

__Arguments__
- `Component` (ReactComponent | Function): use to display the 404 page

## Create an engine

_To do_

## Create a module

_To do_

## Sources

This package is based or have code from over package but not use them directly. How I said, basically I create this package for learn more about __SSR__ with Meteor.
So big thanks to:
- [`meteorhacks:fast-render`](https://github.com/kadirahq/fast-render)
- [`meteorhacks:inject-data`](https://github.com/meteorhacks/inject-data)
- [`meteorhacks:picker`](https://github.com/meteorhacks/picker)
- [`reactrouter:react-router-ssr`](https://github.com/thereactivestack-legacy/meteor-react-router-ssr)
- [`electrode-redux-router-engine`](https://github.com/electrode-io/electrode/tree/762edbafdcd083dbdb0a7978682a08b85b8e8640/packages/electrode-redux-router-engine)
- [`ssrwpo:ssr`](https://github.com/ssrwpo/ssr)
