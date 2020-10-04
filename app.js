const express = require('express')
const app = express()
const port = 3000
const {Device} = require('ps4-waker');
const wol = require('node-wol');
const { exec } = require('child_process');

function checkIP(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!ip.includes('192.168.0.'))
  {
    res.send("local only");
    return false;
  }
  return true;
}

app.get('/ps4', (req, res) => {
if (checkIP(req, res)) {
  var ps4 = new Device({
          bindAddress: "192.168.0.110"
      }
  );
  var promise = ps4.turnOn();
  promise.then(() => {
    console.log('ps4-waker');
    res.send('PS4 woken up!');
    ps4.close()
  }).catch((e) => {
    res.send(`ps4-waker: ${e}`);
    console.log(`ps4-waker: ${e}`)
    ps4.close()
  });
}
});

app.get('/pc', (req, res) => {
  if (checkIP(req, res)) {
    wol.wake('BC:5F:F4:CE:D8:CD', {
    address: '192.168.0.255',
    port: 9
  }, function(error) {
    if(error) {
      // handle error
      console.log(error);
      res.send(error);
      return;
    }
    else{
      console.log('pc-waker');
      res.send('Pc woken up!');
    }
  });
}
});

app.get('/playNova', (req, res) => {
  //
  exec('echo -e \"connect 54:60:09:6F:13:4B\nquit\n\" | bluetoothctl && sleep 2 && mpc play', (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
    res.send(error);
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
   res.send("Playing nova");
   console.log("Playing nova");
  }
  });

});

app.listen(port, () => console.log(`ps4-waker-api app listening on port ${port}!`))
