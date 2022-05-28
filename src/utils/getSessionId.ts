import Configstore from 'configstore'
import { printError, printTip } from './messages.js'

const config = new Configstore('solve3-cli')

const getSessionId = () => {
    const authCookie: string = config.get('authCookie')
    if (!authCookie) {
        printError('Authentication cookie was not found!')
        printTip('Use login command to authenticate')
    } else {
        return authCookie
    }
}

export default getSessionId
