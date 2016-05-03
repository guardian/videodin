const presto = require('presto-client');
const util = require('./util');
const prestoConfig = require('./config/presto');
const awsConfig = require('./config/aws');
const AWS = require('aws-sdk');

const client = new presto.Client(prestoConfig.connection);

const credentials = new AWS.SharedIniFileCredentials({profile: awsConfig.profile});
AWS.config.update({region: 'eu-west-1'});
AWS.config.credentials = credentials;
const s3 = new AWS.S3();

if (process.argv.length < 3) {
  console.info('Usage: node get date|dateRange[, queryName]');
  console.info('date format: YYYY-MM-DD. dateRange format: YYYY-MM-DD--YYYY-MM-DD');
  process.exit(1);
}
// TODO: date range
const inputDate = process.argv[2];
const queryName = process.argv[3];
const dates = util.getDates(inputDate);

util.getFiles('./sql', (err, files) => {
  files.filter(fileName => {
    if (queryName) {
      return fileName === `${queryName}.sql`;
    } else {
      return fileName !== 'all.sql';
    }
  }).forEach(sqlFileName => {
    util.readFile(`./sql/${sqlFileName}`, (err, sql) => {
      dates.forEach(date => {
        const jobName = sqlFileName.replace('.sql', '');
        const cleanSql = sql.replace(';', '').replace('{{DATE}}', date);
        console.info(`Asking presto for ${jobName} on the ${date}`);
        client.execute(cleanSql, (err, data, columns) => {
          if (err) {
            console.info(`Presto Error: `, err);
          } else {
            writeData(jobName, date, data, columns);
          }
        });
      })
    });
  })
});

function writeData(jobName, date, data, columns) {
  const rows = data.map(row => {
    // Bah to mutation
    const o = {};
    columns.map((column, i) => {
      o[column.name] = row[i];
    });
    return o;
  });

  console.info(`Writing JSON for ${jobName}, ${date} with ${rows.length} rows.`);
  util.writeJsonFile(`${jobName}/${date}`, rows, (err, t) => console.info('Local writing complete'));
  const s3Params = {Bucket: awsConfig.s3dataBucket, Key: `data/${jobName}/${util.dateToFolderName(date)}.json`, Body: JSON.stringify(rows, null, 2)};

  s3.putObject(s3Params, (err, data) => {
    if (err) {
      console.info(`S3 putObject Error: `, err);
    } else {
      console.info(`S3 putObject Success`);
    }
  });
}
