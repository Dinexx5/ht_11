import {AttemptModelClass} from "./db";
import {attemptDbModel} from "../models/models";
import {ObjectId} from "mongodb";

export const attemptsRepository = {
    async addNewAttempt(requestData: string, date: string) {
        const newAttempt: attemptDbModel = {
            _id: new ObjectId(),
            requestData: requestData,
            date: date
        }
        const attemptInstance = new AttemptModelClass(newAttempt)
        await attemptInstance.save()
    },
    async countAttempts(requestData: string, tenSecondsAgo: string) {
        return await AttemptModelClass.countDocuments({requestData: requestData, date: {$gte: tenSecondsAgo}})
    }
}