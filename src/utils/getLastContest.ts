import Configstore from 'configstore'
import { printError } from '../utils/messages.js'

const config = new Configstore('solve3-cli')

const getLastContest = () => {
    const lastContest: string = config.get('lastContest')
    if (!lastContest) {
        printError('Last contest was not found!')
        return undefined
    } else {
        return lastContest
    }
}

export default getLastContest
