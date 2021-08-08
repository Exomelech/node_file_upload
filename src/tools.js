const fs = require('fs');
const _path = require('path');

const isDir = async (path) => new Promise(res => {
  fs.lstat(path, (err, stats) => {
    if (err) {
      res(false);
    } else {
      res(stats.isDirectory());
    }
  })
});

const makeDir = async (absolutePath) => new Promise(res => {
  fs.mkdir(absolutePath, (err) => {
    if (err) {
      res(false);
    } else {
      res(true);
    }
  });
})

module.exports = {
  isDir,
  makeDir,
};