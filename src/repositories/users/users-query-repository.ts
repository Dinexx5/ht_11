import {UserModel} from "../db";
import {
    userViewModel,
    paginationQuerys,
    paginatedViewModel, userAccountDbModel
} from "../../models/models";

function mapDbUserToUserViewModel (user: userAccountDbModel): userViewModel {
    return  {
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
        id: user._id.toString()
    }

}
export const usersQueryRepository = {

    async getAllUsers(query: paginationQuerys): Promise<paginatedViewModel<userViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null} = query
        const sortDirectionInt: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedUsersCount = (+pageNumber-1)*+pageSize

        const filter = {} as {
            'accountData.login'?: {$regex: string, $options: string},
            'accountData.email'?: {$regex: string, $options: string},
            $or?: [{'accountData.email': {$regex: string, $options: string } },{'accountData.login': {$regex: string, $options: string }}]
        }
        if (searchLoginTerm && !searchEmailTerm) {
            filter['accountData.login'] = {$regex: searchLoginTerm, $options: 'i' }
        }
        if (searchEmailTerm && !searchLoginTerm) {
            filter['accountData.email'] = {$regex: searchEmailTerm, $options: 'i' }
        }
        if (searchLoginTerm && searchEmailTerm){
            filter.$or =  [{'accountData.email': {$regex: searchEmailTerm, $options: 'i' } }, {'accountData.login': {$regex: searchLoginTerm, $options: 'i' }} ]
        }

        const countAll = await UserModel.countDocuments(filter)
        const usersDb = await UserModel
            .find( filter )
            .sort( {[sortBy]: sortDirectionInt} )
            .skip(skippedUsersCount)
            .limit(+pageSize)
            .lean()

        const usersView = usersDb.map(mapDbUserToUserViewModel)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: usersView
         }
    }


}