import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";
// import { RequestValidationError } from '../errors/request-validation-errors';
// import { DatabaseConnectionError } from '../errors/databse-connection-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.log('Something went wrong', err);

    // if(err instanceof RequestValidationError) {
    //     // console.log('handling this error as a request validation error');
    //     // const formattedErrors = err.errors.map(error => {
    //     //     return { message: error.msg, field: error.path };
    //     // })

    //       return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    // }

    // if(err instanceof DatabaseConnectionError) {
    //     // console.log('handling this error as a db connection error');
    //     return res.status(err.statusCode).send({errors: err.serializeErrors() });
    // }
    // combined both if conditions with CustomError
    if(err instanceof CustomError) {
          return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
       errors: [{ message: err.message }]
    });
};