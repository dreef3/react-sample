require('babel/polyfill');
require('bootstrap');
require('bootstrap/less/bootstrap.less');

const UserStore = require('lib/flickr/userstore');
const Dispatcher = require('lib/flux/dispatcher');
const Context = require('lib/di/context').Context;
Context.register(Dispatcher);

const $ = require('jquery');
const router = require('components/router');

$(() => router());
