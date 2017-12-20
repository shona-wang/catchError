var http = require('http');
var url = require('url');
var util = require('util');
var querystring = require('querystring');
var dbMongo = require('../mongo/dbMongo');
var result = {
    data:[],
    retCod: '',
    message: ''
}; 
let address = 'mongodb://47.94.207.219:27017/test';
let tbName = 'tb_test';

var server = http.createServer(function (req,res) {
    console.log(url.parse(req.url));
    res.setHeader('Access-Control-Allow-Origin', '*');
    var route = url.parse(req.url),
        pathName = route.pathname,
        query = route.query;
    if (req.method == 'GET') {
        if (pathName === '/add') {
            var err = querystring.parse(query)['error'];
            res.writeHead(200,{
                'content-type':'text/plain;charset=utf-8'
            });
            insert({
                error: err
            }).then(function(params) {
                result.retCod = '0';
                res.end(util.inspect(result));
            }.then(function(msg) {
                result.retCod = '-1';
                result.message = msg;
                res.end(util.inspect(result));
            }))
        }else if(pathName === '/select'){
            var start = querystring.parse(query)['start'],
                length = querystring.parse(query)['length'];
            res.writeHead(200,{
                'content-type': 'text/plain;charset=utf-8'
            });
            select({
                start: start,
                length: length
            }).then(function(data){
                result.data = data.list;
                result.retCod = '0';
                result.message = '';
                res.end(util.inspect(result));
            },function(msg){
                result.retCod = '-1';
                result.message = msg;
                res.end(util.inspect(result));
            });
        }
    } else if(req.method == 'POST') {
        if (pathName === '/error') {
            var post = '';
            req.on('data', function (chunk) {
                post += chunk;
            });
            req.on('end', function () {
                post = querystring.parse(post);
                // res.end(util.inspect(post));
            })
        }
    }
});
var insert = function(options) {
    // 连接数据库
    var db = await dbMongo({
        'dbAddress': address
    });
    // 增加数据
    return db.insert({
        tbName: tbName,
        data: options
    });
};
var select = function(params) {
    // 连接数据库
    var db = await dbMongo({
        'dbAddress': address
    });
    // 返回数据
    return db.find({
        tbName: tbName
    });
}
server.listen(8987,function() {
    console.log('server running at localhost:8987');
});