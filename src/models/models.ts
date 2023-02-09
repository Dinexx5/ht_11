
export type createBlogInputModel = {
    name: string
    description: string
    websiteUrl:string
}
export type updateBlogInputModel = {
    name: string
    description: string
    websiteUrl:string
}

export type createPostInputModel = {
    title: string
    shortDescription: string
    content: string
}

export type createPostInputModelWithBlogId = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type updatePostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type blogViewModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type postViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type blogDbModel = {
    _id: Object
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type postDbModel = {
    _id: Object
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type paginatedViewModel<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T
}

export type paramsIdModel = {
    id: string
}

export type createUserInputModel = {
    login: string
    password: string
    email: string
}

export type userViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type userAccountDbModel = {
    _id: Object
    accountData: accountData
    emailConfirmation: emailConfirmation
    passwordRecovery: passwordRecovery
}
export type accountData = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}
export type emailConfirmation = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
export type passwordRecovery = {
    recoveryCode: string | null
    expirationDate: Date | null
}
export type passwordRecoveryModel = {
    newPassword: string
    recoveryCode: string
}

export type resendEmailModel = {
    email: string
}

export type registrationConfirmationInput = {
    code: string
}

export type authInputModel = {
    loginOrEmail: string
    password: string
}

export type createCommentInputModel = {
    content: string
}

export type commentViewModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
export type commentDbModel = {
    _id: Object
    content: string
    createdAt: string
    userId: string
    userLogin: string
    postId: string
}

export type paginationQuerys = {
    sortDirection: string
    sortBy: string
    pageNumber: string
    pageSize: string
    searchNameTerm?: string
    searchLoginTerm?: string
    searchEmailTerm?: string
}
export type refreshTokenDbModel = {
    _id: Object
    issuedAt: string
    deviceId: string
    deviceName: string
    ip: string
    userId: Object
    expiredAt: string
}

export type deviceDbModel = {
    _id: object
    userId: object
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type deviceViewModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}
export type attemptDbModel = {
    _id: object
    requestData: string
    date: string
}