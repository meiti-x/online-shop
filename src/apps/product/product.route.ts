import { Application, Router } from 'express';

import { withAdmin, withAuth } from '@middlewares/auth';

import { productController } from './product.controller';

export function productRoutes(app: Application) {
  const router = Router();

  // Public
  router.get('/', productController.list);
  router.get('/:productId', productController.getOne);

  // Protected
  // TODO: only admin can crud product
  router.post('/', withAuth, withAdmin, productController.create);
  router.put('/:productId', withAuth, withAdmin, productController.update);
  router.delete('/:productId', withAuth, withAdmin, productController.remove);

  app.use('/api/v1/products', router);
}
