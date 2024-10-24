import express from 'express';
import {json} from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// .all will watch for all types of method and routes
//  it will throw error if route not found
//  middleware will catch the error and send formatted response
// app.all('*', () => {
//     throw new NotFoundError()
// });

app.all('*', async (req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

const start = async () => { 
    // we can keep db name here. and mongodb will create it in mongodb.
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');   
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('listening on 3000 !!!!');
    });
};
