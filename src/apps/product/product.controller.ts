import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '@/pkg/error';
import { sendErrorResponse, sendResponse } from '@/pkg/response';

import { CreateProductSchema } from './dto/create-product.dto';
import { productService } from './product.service';

export const productController = {
  async create(req: Request, res: Response) {
    const result = CreateProductSchema.safeParse(req.body);

    if (!result.success) {
      sendErrorResponse({
        res,
        err: new BadRequestError('please fix field errors'),

        fieldErrors: result.error.flatten().fieldErrors,
      });
    }
    productService
      .createProduct(req.body)
      .then((data) => {
        sendResponse({ res, statusCode: StatusCodes.CREATED, data });
      })
      .catch((err) => {
        sendErrorResponse({
          res,
          err,
        });
      });
  },

  async getOne(req: Request, res: Response) {
    productService
      .getProductById(req.params.productId)
      .then((data) => {
        sendResponse({ res, data, statusCode: StatusCodes.OK });
      })
      .catch((err) => {
        sendErrorResponse({ res, err });
      });
  },

  async list(req: Request, res: Response) {
    productService
      .searchProducts(req.query)
      .then((data) => {
        sendResponse({
          res,
          statusCode: StatusCodes.OK,
          data,
        });
      })
      .catch((err) => sendErrorResponse({ res, err }));
  },

  async update(req: Request, res: Response) {
    productService
      .updateProduct(req.params.productId, req.body)
      .then((data) => sendResponse({ res, statusCode: StatusCodes.OK, data }))
      .catch((err) => {
        sendErrorResponse({
          res,
          err,
        });
      });
  },

  async remove(req: Request, res: Response) {
    productService
      .deleteProduct(req.params.productId)
      .then(() => {
        sendResponse({
          res,
          statusCode: StatusCodes.NO_CONTENT,
        });
      })
      .catch((err) => {
        sendErrorResponse({
          res,
          err,
        });
      });
  },
};
