import axios from 'axios'
import { printError } from '../utils/messages.js'

const getSolveData = async (SessionId: string, route: string, suffix: string | number = '', params?: object) => {
    return await axios
        .get(route + suffix, {
            baseURL: 'https://solve.edu.pl/',
            headers: {
                Cookie: `PHPSESSID=${SessionId};`,
            },
            params,
        })
        .then((res) => res.data)
        .catch((error: Error) => {
            printError(error.message)
        })
}

export default getSolveData
