type configType = {
    username: string
    password: string
    authCookie: string
    lastContest: string
    lastTask: string
    favourites: {
        [k: string]: {
            id: string
            name: string
        }
    }
}

export default configType
