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

const LEVELS = ['warn', 'info', 'debug', 'error'];
const LEVEL_OFF = 'off';

export function setLogLevel(level: string) {
  const levelLower = level.toLowerCase();
  if (LEVELS.includes(levelLower)) {
    tracer.setLevel(level);
  } else if (levelLower === LEVEL_OFF) {
    tracer.close();
  } else {
    throw new Error(
      `${levelLower} is not a supported log level, use one of: ${LEVELS}`
    );
  }
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
