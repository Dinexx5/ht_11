import {userAccountDbModel} from "../models/models";


declare global {
    declare namespace Express{
        export interface Request {
            user: userAccountDbModel | null
        }
    }
}