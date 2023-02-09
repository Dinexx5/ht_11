import {usersRepository} from "../repositories/users/users-repository-db";
import {authInputModel, createUserInputModel, userAccountDbModel} from "../models/models";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'
import {emailAdapter} from "../adapters/email-adapter";

export const authService = {

    //registration

    async createUser(body: createUserInputModel): Promise<userAccountDbModel | null> {
        const {login , email, password} = body
        const passwordHash = await this.generateHash(password)
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
                isConfirmed: false
            },
            passwordRecovery: {
                recoveryCode: null,
                expirationDate: null
            }
        }
        const createdAccount = await usersRepository.createUser(newDbAccount)
        try {
            await emailAdapter.sendEmailForConfirmation(email, newDbAccount.emailConfirmation.confirmationCode)
        } catch(error) {
            console.error(error)
            const id = newDbAccount._id.toString()
            await usersRepository.deleteUserById(id)
            return null
        }
        return createdAccount
    },

    async generateHash (password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, passwordSalt)
    },

    async updatePassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user = await usersRepository.findUserByRecoveryCode(recoveryCode)
        const newPasswordHash = await this.generateHash(newPassword)
        return await usersRepository.updatePassword(user!, newPasswordHash)
    },


    async resendEmail(email:string): Promise<boolean> {
        const user: userAccountDbModel | null = await usersRepository.findByLoginOrEmail(email)
        const confirmationCode = uuidv4()
        await usersRepository.updateCode(user!._id, confirmationCode)
        try {
            await emailAdapter.sendEmailForConfirmation(email, confirmationCode)
        } catch(error) {
            console.error(error)
            return false
        }
        return true
    },

    async sendEmailForPasswordRecovery(email:string): Promise<boolean> {
        const user: userAccountDbModel | null = await usersRepository.findByLoginOrEmail(email)
        if (!user) return false
        const confirmationCode = uuidv4()
        const expirationDate = add(new Date(), {hours: 1})
        await usersRepository.updateRecoveryCode(user, confirmationCode, expirationDate)
        try {
            await emailAdapter.sendEmailForPasswordRecovery(email, confirmationCode)
        } catch(error) {
            console.error(error)
            return false
        }
        return true
    },


    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        return await usersRepository.updateConfirmation(user!._id)

    },

    //login

    async checkCredentials (body: authInputModel): Promise<userAccountDbModel | null> {
        const {loginOrEmail, password} = body
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return null
        }
        if (!user.emailConfirmation.isConfirmed) {
            return null
        }
        const isValidPassword = await bcrypt.compare(password, user.accountData.passwordHash)

        if (!isValidPassword) {
            return null
        }
        return user

    }

}
