/*jslint node: true */
// var ws = require('ws');
var send = require('send');
var path = require('path');
var util = require('util');
var Router = require('regex-router');
var logger = require('loge');
var vm = require('vm');

var R = new Router(function(req, res) {
  res.status(404).die('No resource at: ' + req.url);
});

// var ws_server = new ws.Server({noServer: true});

var contexts = {};

// static/*
R.get(/^\/static\/([^?]+)(\?|$)/, function(req, res, m) {
  var root = path.join(__dirname, '..', 'static');
  send(req, m[1]).root(root)
    .on('error', function(err) {
      res.die(err.status || 500, 'send error: ' + err.message);
    })
    .on('directory', function() {
      res.status(404).die('No resource at: ' + req.url);
    })
    .pipe(res);
});

// R.any(/^\/contexts\/(\w+)$/, function(req, res, m) {
//   var context_id = m[1];
//   ws_server.handleUpgrade(req, req.socket, req.upgradeHead, function(client) {
//     logger.debug('upgrading websocket connection established for harder (url: %s)', client.upgradeReq.url);

//     client.on('message', function() {
//     });
//   });
// });

// action_server.handleUpgrade(req, req.socket, req.upgradeHead, function(client) {
//   logger.debug('websocket connection established for harder (url: %s)', client.upgradeReq.url);
// });

R.post(/^\/contexts\/(\w+)\/run/, function(req, res, m) {
  var context_id = m[1];
  req.readData(function(err, data) {
    if (err) return res.die('Error reading request data: ' + err.toString());

    var code = data.code;
    if (contexts[context_id] === undefined) {
      contexts[context_id] = vm.createContext();
    }

    var context = contexts[context_id];
    var output = vm.runInContext(code, context);

    // console.log(util.inspect(context), result);
    res.ngjson({
      code: code,
      output: output,
      context: context,
    });
  });
});

module.exports = R.route.bind(R);
