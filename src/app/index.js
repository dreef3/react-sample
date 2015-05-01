require('babel/polyfill');
require('bootstrap');
require('bootstrap/less/bootstrap.less');

var Context = require('lib/di/context').Context;
var $ = require('jquery');
var router = require('components/router');
var UserStore = require('lib/flickr/userstore');
var Dispatcher = require('lib/flux/dispatcher');
var store = Context.instance(UserStore);
store.register(Dispatcher.instance());

$(() => router());
