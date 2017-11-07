const express = require('express');
const fs = require("fs");
const httpProxy = require("http-proxy");
const { argv } = require("yargs")
    .default("port", 8000)
    .default("protocol", "http")
    .default("host", "127.0.0.1")
    .default("run", 80)
    .alias("r", "run");

var proxy = httpProxy.createProxy({
    target: `${argv.protocol}://${argv.host}:${argv.port}`
});
proxy.on("error", (error, req, res, url) => {
    console.error(error);
    res.statusCode = 500;
    res.write("Proxy Error");
    res.end();
});

const jade_path = "./pug"
var app = express();

app.use(express.static('./static'));
app.set('views', jade_path);
app.set('view engine', 'pug');

// 获取中转服务器信息
// var socket = require('socket.io-client')(
//     `${manage_server.protocol}://${manage_server.host}:${manage_server.port}`
// );

// socket.emit("project", 1);

// socket.on("interface list", data => {
//     data.forEach(value => {
//         app[value.method](value.router, proxy);
//     });
// });

// socket.on("proxy info", data => {
//     proxy_server.port = data.port;
// });
app.all("/api/*", (req, res) => { proxy.web(req, res) });

fs.readdir(jade_path, (err, files) => {
    files.forEach(file => {
        var path = /^(.+)\.pug$/.exec(file);
        if (path) {
            app.get(`/${path[1]}`, (req, res) => {
                res.render(path[1]);
            });
        }
    })
});

app.get('/', function (req, res) {
    res.redirect('/developer');
});

var server = app.listen(argv.run, function () {
    console.info(`server running on :${argv.run}`);
});

server.on("error", console.error);