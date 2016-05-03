const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;

exports.readFile = (path, callback) => {
    try {
        const filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
};

exports.getFiles = (path, callback) => {
  fs.readdir(path, callback);
};


exports.writeJsonFile = (filename, data, cb) => {
  const fullFilename = `./json/${filename}.json`;
  mkdirp(getDirName(fullFilename), function (err) {
    if (err) return cb(err);
    fs.writeFile(fullFilename, JSON.stringify(data, null, 2) , 'utf-8', cb);
  });
};

exports.dateToFolderName = date => date.replace(/-/g, '/');
