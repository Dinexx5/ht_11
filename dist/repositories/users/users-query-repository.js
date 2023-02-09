"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersQueryRepository = void 0;
const db_1 = require("../db");
function mapDbUserToUserViewModel(user) {
    return {
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
        id: user._id.toString()
    };
}
exports.usersQueryRepository = {
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = query;
            const sortDirectionInt = sortDirection === "desc" ? -1 : 1;
            const skippedUsersCount = (+pageNumber - 1) * +pageSize;
            const filter = {};
            if (searchLoginTerm && !searchEmailTerm) {
                filter['accountData.login'] = { $regex: searchLoginTerm, $options: 'i' };
            }
            if (searchEmailTerm && !searchLoginTerm) {
                filter['accountData.email'] = { $regex: searchEmailTerm, $options: 'i' };
            }
            if (searchLoginTerm && searchEmailTerm) {
                filter.$or = [{ 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } }, { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } }];
            }
            const countAll = yield db_1.UserModel.countDocuments(filter);
            const usersDb = yield db_1.UserModel
                .find(filter)
                .sort({ [sortBy]: sortDirectionInt })
                .skip(skippedUsersCount)
                .limit(+pageSize)
                .lean();
            const usersView = usersDb.map(mapDbUserToUserViewModel);
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: usersView
            };
        });
    }
};
