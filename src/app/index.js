'use strict';

require('bootstrap');
require('bootstrap/less/bootstrap.less');
var router = require('components/router');
var UserStore = require('lib/flickr/userstore');
var Dispatcher = require('lib/flux/dispatcher');
var store = new UserStore();
store.register(Dispatcher.instance());

$(() => router());
