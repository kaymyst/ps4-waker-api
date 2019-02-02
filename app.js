const express = require('express')
const app = express()
const port = 3000
const {Device} = require('ps4-waker');
const wol = require('wol');

app.get('/ps4', (req, res) => {
console.log('ps4-waker');
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
  console.log('pc-waker');
  wol.wake('BC:5F:F4:CE:D8:CD', function(err, res){
  console.log(res);
});
});

app.listen(port, () => console.log(`ps4-waker-api app listening on port ${port}!`))
