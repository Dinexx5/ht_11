import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'

import mongoose from "mongoose";
import {
    attemptSchema,
    blogSchema,
    commentSchema,
    deviceSchema,
    postSchema,
    tokenSchema,
    userAccountSchema
} from "../models/schemas";

dotenv.config()


const mongoUri = process.env.MONGO_URL!
if (!mongoUri) {
    throw new Error("No mongo URL")
}
// const dbName = 'mongooseDB';
// const client = new MongoClient(mongoUri)

// const db = client.db();

// export const blogsCollection = db.collection<blogDbModel>("blogs")
// export const postsCollection = db.collection<postDbModel>("posts")
// export const userAccountsCollection = db.collection<userAccountDbModel>("userAccounts")
// export const commentsCollection = db.collection<commentDbModel>("comments")
// export const tokenCollection = db.collection<refreshTokenModel>("tokens")
// export const devicesCollection = db.collection<deviceDbModel>("devices")



export const BlogModelClass = mongoose.model('blogs', blogSchema);
export const PostModelClass = mongoose.model('posts', postSchema);
export const UserModel = mongoose.model('userAccounts', userAccountSchema);
export const CommentModelClass = mongoose.model('comments', commentSchema);
export const TokenModel = mongoose.model('tokens', tokenSchema);
export const DeviceModelClass = mongoose.model('devices', deviceSchema);
export const AttemptModelClass = mongoose.model('attempts', attemptSchema);


export async function runDb() {
    try {
        // Connect client tot the server
        // await client.connect();
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongoUri);
        // Establish and verify connection
        // await client.db().command({ ping: 1 });

        // await mongoose.

        console.log("Connected successfully to mongo server");
    } catch {
        console.log ("Can not connect to mongo db");
        //Ensures that client will close after finish/error
        // await client.close()
        await mongoose.disconnect()
    }
}