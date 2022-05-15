import * as express from 'express';
import { MEZZO_API_PUT_GENERATE_MOCK } from '@caribou-crew/mezzo-constants';
import { Mezzo } from '../core';
import logger from '@caribou-crew/mezzo-utils-logger';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import * as fs from 'fs';

function setupAPI(app: express.Express) {
  logger.info('Adding POST endpoint ', MEZZO_API_PUT_GENERATE_MOCK);

  const mbToBytes = (megabytes = 20) => megabytes * 1000 * 1000;
  app.use(
    fileUpload({
      limits: { fileSize: mbToBytes(Number(process.env.fileLimit)) },
      abortOnLimit: true, // returns 413 is limit is reached
      debug: true,
      createParentPath: true,
      // useTempFiles : true, // Use disk as temp dir instead of RAM, useful if uploading multiple files and ram is an issue
      // tempFileDir : '/tmp/'
    })
  );

  app.post(MEZZO_API_PUT_GENERATE_MOCK, (req, res, next) => {
    const file = req.files.mockResponseFile as fileUpload.UploadedFile; // Fix wrongly typed definition. https://github.com/marc2332/DefinitelyTyped/commit/d59016211f919aa330ff29eef3b2096048e2e813 fixes it in @types/node, but only works for v1.1  so we need to use @types/express-fileupload which has the wrong type
    const { method, routePath, id, icons, titleIcons, variant } = req.body;
    const generatedId = id || `${method} ${routePath}`;
    const extension = file.name.split('.').pop();
    const fileName = `${variant}.${extension}`;

    const supportedExtensionTypes = ['jpg', 'png', 'gif', 'html', 'json'];
    if (!supportedExtensionTypes.includes(extension)) {
      res.status(415);
      res.send('unsupported file type');
      return;
    }

    const mockedDirectoryBase = process.env.mockedDirectoryBase;
    const mockedDataPath = path.join(
      mockedDirectoryBase,
      'mocked-data',
      routePath,
      method.toUpperCase(),
      fileName
    );

    if (fs.existsSync(mockedDataPath)) {
      res.status(409);
      res.send(`File already exists in ${mockedDataPath}`);
      return;
    }

    file.mv(mockedDataPath);

    res.send({
      method,
      routePath,
      id: generatedId,
      icons,
      titleIcons,
      fileName: fileName,
    });
  });
}

export default () => (mezzo: Mezzo) => {
  setupAPI(mezzo.app);
  return {
    name: 'generate-mock-plugin',
  };
};
