const express = require('express');
const fs = require('fs');
const os = require('os');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const mime = require('mime');

const app = express();

app.use(cors());
app.use(express.json());

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
      let type = mime.getType(location + file);
      if (type !== null) {
        type = type.split('/')[0];
        return (type === 'video' || type === 'audio');
      }
      else return false;
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
  let dir = req.body.locationDir;
  if (dir.length > 0) {
    if (dir.length !== 1 && dir.charAt(dir.length - 1) !== '/') dir += '/';
    fileAdder(dir);
    if (files.length) {
      absolutePathToTheMediaFile = dir;
      res.json(files);
    }
    else res.status(404).send(msg);
  }
  else {
    res.status(404).send('Send proper location');
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
  const stat = fs.statSync(vidPath)
  const fileSize = stat.size
  const range = req.headers.range
  const contentType = mime.getType(vidPath);

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
      'Content-Type': contentType,
    };

    res.writeHead(206, head);
    file.pipe(res);
  }
  else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
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
    .catch(err => console.log('Server IP: Unable to get public IP\n---\n'));
  console.log('Local Server Addresses: ', myLocalIPs);
  console.log('Server Port: ', this.address().port);
});