import { Request, Response } from 'express';
import mezzo from '../index';

mezzo.route({
  id: 'GET /hi/mom',
  method: 'GET',
  path: '/hi/mom',
  callback: function () {
    return 'HI';
  },
});

mezzo.route({
  method: 'GET',
  path: '/respondWithCustomCoding',
  callback: function (req, res) {
    res.send({ someCustomCodingResponse: true });
  },
});

mezzo.route({
  method: 'GET',
  path: '/respondWithCustomCodingAndStatus',
  callback: function (req: Request, res: Response) {
    res.status(401).json({ someCustomError: true });
  },
});

mezzo.route({
  method: 'GET',
  path: '/hi/bob/:somethingDynamic',
  // handler: function () {
  //   return 'HI dynamic';
  // },
  callback: (req, res, next) => {
    res.send(req.params.somethingDynamic);
  },
});

const someRoute = mezzo.route({
  id: 'respondWithVariant-reply-from-file',
  label: 'Respond With Variant from file',
  path: '/respondWithVariantReplyFromFile',
  // variantLabel: 'Respond With Variant From File',
  // handler: function (req, h: Hapi.ResponseToolkit) {
  //   return midway.util.respondWithMockVariant(this, 'variant1', req, h); // make sure that the variant exist in the same route.
  // },
  callback: (req, res) => {
    // return mezzo.util.respondWithMockVariant(this, 'variant1', req, h); // make sure that the variant exist in the same route.
    // return mezzo.util.respondWithFile(this, 'variant1', req, h); // make sure that the variant exist in the same route.
    return mezzo.util.respondWithFile(req, res); // make sure that the variant exist in the same route.
  },
});
console.log('SomeRoute Before: ', someRoute);
someRoute.variant({
  id: 'variant1',
  label: 'Respond With Mock Variant From file - variant1',
  callback: function (req, res) {
    return mezzo.util.respondWithFile(this, res);
  },
});
console.log('SomeRoute After: ', someRoute);

mezzo.route({
  path: '/respondWithFile',
  callback: (req: Request, res: Response) => {
    return mezzo.util.respondWithFile(req, res);
  },
});

// mezzo.route({
//   path: '/add',
//   callback: (req: Request, res: Response) => {
//     mezzo.route({ path: '/more', callback: () => {} });
//     // return mezzo.util.respondWithFile(req, res);
//     res.send('HI');
//   },
// });
// mezzo.route({
//   path: '/list',
//   callback: (req: Request, res: Response) => {
//     return mezzo.util.respondWithFile(req, res);
//   },
// });
