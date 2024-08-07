import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-errors';
import { DatabaseConnectionError } from '../errors/databse-connection-error';
const router = express.Router();

router.get('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
],
    (req: Request, res: Response) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        // // return res.status(400).send(errors.array());
        // throw new Error('Invalid email or Password');
        throw new RequestValidationError(errors.array());
    }

    // const { email, password } = req.body;

    // if(!email || typeof email !== 'string') {
    //     res.status(400).send('Provide a valid email');
    // }
    console.log('creating user...');
    throw new DatabaseConnectionError();

    res.send();
    // res.send('Hi there');
});

export { router as signupRouter };