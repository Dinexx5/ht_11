import {usersRepository} from "../repositories/users/users-repository-db";
import {createUserInputModel, userAccountDbModel, userViewModel} from "../models/models";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {authService} from "./auth-service";

export const usersService = {

//by superAdmin
    async createUser(body: createUserInputModel): Promise<userViewModel> {
        const {login , email, password} = body
        const passwordHash = await authService.generateHash(password)
        const newDbAccount: userAccountDbModel = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: true
            },
            passwordRecovery: {
                recoveryCode: null,
                expirationDate: null
            }
        }
        return await usersRepository.createUserByAdmin(newDbAccount)
    },


    async deleteUserById(userId:string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)
    },


    async findUserById(userId: Object): Promise<userAccountDbModel> {
        return await usersRepository.findUserById(userId)
    },





}
