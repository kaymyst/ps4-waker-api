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
          bindAddress: "192.168.0.12"
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
    wol.wake('40:8D:5C:84:3A:58', {
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
  exec("pulseaudio --start; bluetoothctl -- connect 54:60:09:6F:13:4B && mpc play 1", (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
    res.send(err);
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
   res.send("Playing nova");
   console.log("Playing nova");
  }
  });

});

app.get('/playFIP', (req, res) => {
  //
  exec("pulseaudio --start; bluetoothctl -- connect 54:60:09:6F:13:4B && mpc play 2", (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
    res.send(err);
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
   res.send("Playing FIP");
   console.log("Playing FIP");
  }
  });

});

app.get('/stopRadio', (req, res) => {
  //
  exec("mpc stop && bluetoothctl -- disconnect 54:60:09:6F:13:4B", (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
    res.send(err);
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
   res.send("Stopped nova");
   console.log("Stopped nova");
  }
  });

});

app.listen(port, () => console.log(`ps4-waker-api app listening on port ${port}!`))
