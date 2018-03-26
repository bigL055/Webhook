var express = require('express');
var router = express.Router();
var wss = require('../websocket')
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

module.exports = router;
