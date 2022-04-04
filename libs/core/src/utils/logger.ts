// import './env';

// import * as winston from 'winston';

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [new winston.transports.Console()],
// });

// export default logger;

// import 'source-map-support/register';

import * as tracer from 'tracer';
import * as Colors from 'colors';

const monthNames = Object.freeze([
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]);

function toTwoDigitString(value: number): string {
  let text = value + '';
  if (value < 10) {
    text = '0' + value;
  }
  return text;
}

function getLogTimeStamp() {
  const date = new Date();
  const month = monthNames[date.getMonth()];
  return (
    date.getDate() +
    ' ' +
    month +
    ' ' +
    date.getFullYear() +
    ' ' +
    date.getHours() +
    ':' +
    toTwoDigitString(date.getMinutes()) +
    ':' +
    toTwoDigitString(date.getSeconds()) +
    '.' +
    date.getMilliseconds()
  );
}

const logLevel = process.env.LOG_LEVEL || 'info';
export default tracer.colorConsole({
  format: '{{timestamp}} [{{title}}] - [{{file}}:{{line}}] - {{message}}',
  preprocess: function (data) {
    data.title = data.title.toUpperCase();
    data.timestamp = getLogTimeStamp();
  },
  filters: {
    debug: Colors.magenta,
    info: Colors.green,
    warn: Colors.yellow,
    error: Colors.red,
  },
  level: logLevel,
});
