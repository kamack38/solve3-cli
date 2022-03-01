import axios from 'axios'
import { printError } from '../utils/messages.js'

const getSolveData = async (SessionId: string, route: string, param: string | number = '', suffix?: string | number, suffixSeparator?: string) => {
    return await axios
        .get(route + param + (suffix ? (suffixSeparator ? suffixSeparator + suffix : '/' + suffix) : ''), {
            baseURL: 'https://solve.edu.pl/',
            headers: {
                Cookie: `PHPSESSID=${SessionId};`,
            },
        })
        .then((res) => res.data)
        .catch((error) => {
            printError(error)
        })
}

export default getSolveData
