let express = require('express');
let router = express.Router();
let wss = require('../websocket');
let shell = require('child_process');
let ws;


wss.on('connection', function (wsItem) {
    ws = wsItem
});

/* GET users listing. */
router.all('/wh/listen', function (req, res) {
    if (ws === undefined) {
        res.json({message: "客户端未连接."})
    } else {
        ws.send(JSON.stringify({
            headers: req.headers,
            body: req.body
        }), (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
        res.json({message: "ok"})
    }
});

var is_updateing = false
router.all('/wh/update', function (req, res) {
    if (is_updateing) return;
    is_updateing = true;
    wss.close();
    wss.removeAllListeners();
    let index = __dirname.lastIndexOf('WebhookServer');
    let path = __dirname.substr(0, index + 'WebhookServer'.length);
    shell.exec('sh ' + path + '/git_update.sh', (error, stdout, stderr) => {
        res.json({
            error: error,
            stdout: stdout,
            stderr: stderr
        })

        shell.exec('sh ' + path + '/app_restart.sh', (error, stdout, stderr) => {
            console.log(JSON.stringify({
                error: error,
                stdout: stdout,
                stderr: stderr
            }))
        })
    })
});

module.exports = router;
