import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-errors';
import { DatabaseConnectionError } from '../errors/databse-connection-error';
import { BadRequestError } from '../errors/bad-request-error';
const router = express.Router();

router.get('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
],
   async (req: Request, res: Response) => {

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

    // Its just to have extra example of cutom error.
    // console.log('creating user...');
    // throw new DatabaseConnectionError();

    // res.send();
    // res.send('Hi there');


    // extracting email and password from request object.
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        // console.log('Email in use');
        // return res.send({});
        // instead of returning error, we use error handling middleware and throw the error.
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password});
    
    // this will save user to the database.
    await user.save();

    res.status(201).send(user);
});

export { router as signupRouter };