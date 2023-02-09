import {UserModel} from "../db";
import {userAccountDbModel, userViewModel} from "../../models/models";
import {ObjectId} from "mongodb";


export const usersRepository = {
    //for superAdmin:

    async createUserByAdmin(newDbUser: userAccountDbModel): Promise<userViewModel> {
        await UserModel.create(newDbUser)
        return {
            id: newDbUser._id.toString(),
            login: newDbUser.accountData.login,
            email: newDbUser.accountData.email,
            createdAt: newDbUser.accountData.createdAt
        }

    },

    async deleteUserById(id:string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await UserModel.deleteOne({_id: _id})
        return result.deletedCount === 1

    },

    // req.user in bearerAuthMiddleware

    async findUserById(userId: Object): Promise<userAccountDbModel> {
        let user = await UserModel.findOne({_id: userId}).lean()
        return user!
    },

    // for regular creation of user

    async createUser(newDbUser: userAccountDbModel): Promise<userAccountDbModel> {
        await UserModel.create(newDbUser)
        return newDbUser
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<userAccountDbModel | null> {
        return await UserModel.findOne( {$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}] } ).lean()
    },

    //email resending

    async findUserByConfirmationCode(code: string): Promise<userAccountDbModel | null> {
        return await UserModel.findOne({'emailConfirmation.confirmationCode': code}).lean()

    },

    async findUserByRecoveryCode(code: string): Promise<userAccountDbModel | null> {
        return await UserModel.findOne({'passwordRecovery.recoveryCode': code}).lean()
    },

    async updateConfirmation (_id: Object): Promise<boolean> {
        let result = await UserModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true} })
        return result.modifiedCount === 1
    },

    async updateCode (_id: Object, code: string): Promise<boolean> {
        let result = await UserModel.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': code} })
        return result.modifiedCount === 1
    },

    async updateRecoveryCode (user: userAccountDbModel, code: string, expirationDate: Date): Promise<boolean> {
        let result = await UserModel.updateOne({_id: user._id}, {
            $set: {
                'passwordRecovery.recoveryCode': code,
                'passwordRecovery.expirationDate': expirationDate}
        })
        return result.modifiedCount === 1
    },

    async updatePassword (user: userAccountDbModel, newPasswordHash: string): Promise<boolean> {
        let result = await UserModel.updateOne({_id: user._id}, {$set: {'accountData.passwordHash': newPasswordHash}})
        return result.modifiedCount === 1
    },


}