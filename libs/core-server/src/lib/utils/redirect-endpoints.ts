import express from 'express';

export const addRedirect = (
  app: express.Express,
  inPath: string,
  outPath: string
) => {
  app.get(inPath, (req, res) => {
    res.redirect(outPath);
  });
};
