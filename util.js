const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const moment = require('moment');
require('moment-range');

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

exports.getDates = dateOrDateRange => {
    const splitRange =  dateOrDateRange.split('--');
    const range = splitRange.length === 1 ? [splitRange[0], splitRange[0]] : splitRange;
    const dates = [];
    // Annoyingly moment-range doesn't have a `map`, but a by;
    moment.range(range.map(date => moment(date, 'YYYY-MM-DD'))).by('days', day =>
        dates.push(day.format('YYYY-MM-DD')));

    return dates;
};
