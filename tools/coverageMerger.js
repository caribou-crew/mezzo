const glob = require('glob');
const fs = require('fs');
const path = require('path');

const getLcovFiles = async function (src) {
  return await glob(`${src}/**/lcov.info`, {
    ignore: 'node_modules/**',
  });
};

(async function () {
  const files = await getLcovFiles('coverage');
  const mergedReport = files.reduce(
    (mergedReport, currFile) => (mergedReport += fs.readFileSync(currFile)),
    ''
  );
  await fs.writeFile(
    path.resolve('./coverage/lcov.info'),
    mergedReport,
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );
})();
