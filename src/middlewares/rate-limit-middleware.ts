import {NextFunction, Request, Response} from "express";
import {subSeconds} from "date-fns";
import {attemptsRepository} from "../repositories/attempts-repository";

export const limiter = async (req: Request, res: Response, next: NextFunction) => {
    const {ip, url} = req
    const requestData = ip + url
    const dateNow = new Date().toISOString()
    await attemptsRepository.addNewAttempt(requestData, dateNow)
    const tenSecondsAgo = subSeconds(new Date(dateNow), 10).toISOString()
    const requestsCount = await attemptsRepository.countAttempts(requestData,tenSecondsAgo)
    if (requestsCount > 5) {
        return res.status(429).send('too many requests')
    }
    return next()
}


