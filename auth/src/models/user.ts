import mongoose from "mongoose";


// An interface that decscribes the properties required to create new user
interface UserAttrs {
    email: string;
    password: string;
}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }, password: {
        type: String,
        required: true
    }
});

// const User = mongoose.model('User', userSchema);
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// }
// buildUser({
//     email: 'test@test.com',
//     password: '2323r23423',
// })
// export { User, buildUser };
// here while creating new User Typescript has no mechanism to typecheck mongoose defined model. So rather than using:
// new User()
// we created a function buildUser and passed typecheck on parameters. 
// now we have exported the function as well. Which will help to create User with type check anywhere in the application.

// NEW METHOD
// because we dont want to manage overhead of exporting extra function.
// here User.build should work fine but just because mongoose and typescript doesnt go well with each other it is showing error.
// If we use Javascript instead of Typescript things should work just fine.

// userSchema.statics.build = (attrs: UserAttrs) => {
//     return new User(attrs);
// }
// const User = mongoose.model('User', userSchema);
// User.build({
//     email: 'test@test.com',
//     password: '2323r23423',
// })
// export { User };


// NEW METHOD
// An interface that descripbe the properties that a User Model has
// Here we got a type check but it takes some mysterious code (<any>) to achieve that.
// interface UserModel extends mongoose.Model<any> {
//     build(attrs: UserAttrs): any;
// }
// userSchema.statics.build = (attrs: UserAttrs) => {
//     return new User(attrs);
// }
// const User = mongoose.model<any, UserModel>('User', userSchema);
// // User.build({
// //     email: 'test@test.com',
// //     password: '2323r23423',
// // })
// export { User };

// Here, till now we have solved issue number 1 that is:
// We wanted Typescript to have some type check on creating new object from mongoose model.


// issue 2: MongoDB adds createdAt, updatedAt properties in the object. So we need to tell typescript that the object created has different properties compared to object received of same type.


interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };


// Angular brackets are generics. Its a types being provided to function.