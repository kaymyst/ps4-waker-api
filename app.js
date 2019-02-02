const express = require('express')
const app = express()
const port = 3000
const {Device} = require('ps4-waker');
const wol = require('node-wol');

app.get('/ps4', (req, res) => {

var ps4 = new Device();
var promise = ps4.turnOn();
promise.then(() => {
  res.send('PS4 woken up!');
  ps4.close()
}).catch((e) => {
  res.send(`ps4-waker: ${e}`);
  console.log(`ps4-waker: ${e}`)
  ps4.close()
});

});

app.get('/pc', (req, res) => {
  wol.wake('BC:5F:F4:CE:D8:CD', {
  address: '192.168.0.255',
  port: 9
}, function(error) {
  if(error) {
    // handle error
    console.console.log(error);
    return;
  }
});
});

app.listen(port, () => console.log(`ps4-waker-api app listening on port ${port}!`))
