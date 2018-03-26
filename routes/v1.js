var express = require('express');
var router = express.Router();
var wss = require('../websocket')
var shell = require('child_process')
var ws


wss.on('connection', function (wsItem) {
    ws = wsItem
});

/* GET users listing. */
router.all('/wh/listen', function (req, res, next) {
    if (ws == undefined) {
        res.json({message: "客户端未连接."})
    }else{
        ws.send(JSON.stringify({
            headers: req.headers,
            body:req.body
        }),(err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        })
        res.json({message: "ok"})
    }
});

router.all('/wh/update',function (req, res, next) {
    let index = __dirname.lastIndexOf('WebhookServer')
    let path = __dirname.substr(0,index + 'WebhookServer'.length)
    shell.exec('sh ' + path + '/AppUpdate.sh', (error, stdout, stderr) => {
        res.json({
            error: error,
            stdout: stdout,
            stderr: stderr
        })
    })
})

module.exports = router;
