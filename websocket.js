// 导入WebSocket模块:
let WebSocket = require('ws');
// 引用Server类/实例化:
let wss = new WebSocket.Server({ port: 10001 });

module.exports = wss