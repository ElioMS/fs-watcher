const express = require('express');
const app = express();
const axios = require('axios');

var chokidar = require('chokidar');
var http = require('http');
var watcher = chokidar.watch('/home/peruapps/myfiles', {
    // ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});
var log = console.log.bind(console);

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/', function (req, res) {
    res.json({"message": "Hello World!!"});
});

const storeFile = function (path) {
    axios.post("http://192.168.1.113:8080/files", {name: path})
        .then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error.response.data)
        })
};

const deleteFile = async function (path) {
    axios.post("http://192.168.1.113:8080/files/delete", {name: path})
        .then(response => {
            console.log(`Directorio ${path} eliminado.`)
        })
};


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
        // .on('change', path => log(`File ${path} has been changed`))
    watcher
        //.on('add', path => storeFile(path))
        .on('addDir', path => log(`Directory ${path} has been created`))
        .on('change', path => log(`File ${path} has been changed`))
        .on('unlinkDir', path => log(`Directory ${path} has been deleted`))
        .on('unlink', path => log(`File ${path} has been deleted`))
        .on('error', error => log(`Watcher error: ${error}`))
        .on('ready', () => log('Initial scan complete. Ready for changes'))
        
        .on('rename', function (oldfile,newfile,stat){
            log(oldfile, newfile)
        });
});