const express = require('express');
const fs = require('fs');
const os = require('os');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

//basically ek string bhejo idhar jo directory ka location hoga then directory lo and files nikal lo unke location ko ek array me store kar lo and unke name ko
//display karo frontend me and then jab user click kare us video pe tab new tab me us video ko play karo and
//server ko us video ka path bhejo jo idhar assign ho jayega and it will play.
/* 
step 1: location bhejo idhar
step 2: files nikalo and ek array me unka location dalte jao
step 3: send this array to react
step 4: array ke names and file ke names ko match karke connect kar do
step 5: jab wo ek index pe click kare tab backend me wo index and array bhejo and us index ko access karke us video ko play kar do
*/

//so wo react location bhejega and server symlinks bana dega public folder me and then path ko de denge wo link whenever we play it

let my_ip = '';
let my_port = '';
let myLocalIPs = [];
let files = [];
let msg = '';
let absolutePathToTheMediaFile = '';

const interfaces = os.networkInterfaces();
for (let k in interfaces) {
  for (let p in interfaces[k]) {
    let addr = interfaces[k][p];
    if (addr.family === 'IPv4' && !addr.internal) {
      myLocalIPs.push(addr.address);
    }
  }
}

const fileAdder = (location) => {
  try {
    files = fs.readdirSync(location).filter((file) => {
      return path.extname(file) === '.mp4';
    });

    if (files.length == 0) {
      msg = 'No video present';
    }
    else msg = 'success'
  }
  catch {
    msg = 'send valid path';
  }
};

app.post('/setLocation', (req, res) => {
  // const location = req.body.locationDir;
  // console.log('in express', location);
  files = [];
  msg = '';
  absolutePathToTheMediaFile = '';
  const dir = req.body.locationDir;
  if (dir.length > 0) {
    fileAdder(req.body.locationDir);
    if (files.length) {
      absolutePathToTheMediaFile = dir;
      res.json(files);
    }
    else res.status(404).send(msg);
  }
  else {
    res.status(404).send('send something');
  }
});

app.get('/', (req, res) => {
  if (files.length) {
    res.json(files);
  }
  else res.send('Connected');
});


// app.get('/test/:id', (req, res) => {
//   console.log(req.params.id);
//   console.log(files[req.params.id]);
//   console.log(path.relative(__dirname, absolutePathToTheMediaFile) + '/' + files[req.params.id]);
// })

app.post('/reset', (req, res) => {
  files = [];
  msg = '';
  absolutePathToTheMediaFile = '';
  res.send('cleared');
});

app.get('/videos/:id', function (req, res) {
  const vidPath = path.relative(__dirname, absolutePathToTheMediaFile) + '/' + files[req.params.id];
  console.log(vidPath);
  const stat = fs.statSync(vidPath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    //replaces bytes= string in range with "" and then splits the remaining string into two parts using - delimiter;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (!isNaN(start) && isNaN(end)) {
      end = size - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
      start = fileSize - end;
      end = fileSize - 1;
    }

    if (start >= fileSize) {
      console.log(start);
      console.log(end);
      console.log(fileSize);
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(vidPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  }
  else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(vidPath).pipe(res);
  }
});

app.listen(3001, function () {
  console.log('connected');
  axios.get('https://api.ipify.org/?format=text')
    .then((res) => {
      my_ip = res.data
      console.log('Server IP: ', my_ip);
    })
    .catch(err => console.log(err));
  console.log('Local Server Addresses: ', myLocalIPs);
  console.log('Server Port: ', this.address().port);
});