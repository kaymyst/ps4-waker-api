const express = require('express')
const app = express()
const port = 3000
const {Device} = require('ps4-waker');

app.get('/', (req, res) => {

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

})

app.listen(port, () => console.log(`ps4-waker-api app listening on port ${port}!`))
