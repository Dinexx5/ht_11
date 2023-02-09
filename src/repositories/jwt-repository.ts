import {TokenModel} from "./db";
import {refreshTokenDbModel} from "../models/models";


export const jwtRepository = {

    async saveRefreshTokenMeta(newDbToken: refreshTokenDbModel) {
        await TokenModel.create(newDbToken)

    },

    async updateRefreshToken(expirationDate: string, newExpirationDate: string, newIssuedAt: string): Promise<boolean> {
        const result = await TokenModel.updateOne( {expiredAt: expirationDate}, {$set: {expiredAt: newExpirationDate, issuedAt: newIssuedAt} } )
        return result.modifiedCount === 1
    },

    async findToken(refreshToken: string): Promise<boolean> {
        const isFound = await TokenModel.findOne({token: refreshToken})
        if (!isFound){
            return false
        }
        return true
    },

    async deleteSession(expirationDate: string): Promise<boolean> {
        const result = await TokenModel.deleteOne({expiredAt: expirationDate})
        return result.deletedCount === 1
    },
    async findRefreshTokenByExpirationDate(expirationDate: string): Promise<boolean> {
        const foundToken = await TokenModel.findOne({expiredAt: expirationDate})
        if (!foundToken) {
            return false
        }
        return true
    }
}