import Configstore from 'configstore'
import { printInfo, printError, printTip, printValue } from '../utils/messages.js'
import configType from '../types/configType.js'

const config = new Configstore('solve3-cli')

const changeConfig = (option: string, value: string) => {
    if (option) {
        if (config.has(option)) {
            if (value) {
                config.set(option, value)
                printInfo(option, value)
            } else {
                const val: keyof configType = config.get(option)
                printValue(option, JSON.stringify(val, null, 2))
            }
        } else {
            const availableOptions = Object.keys(config.all).toString().replace(/,/g, ', ')
            printError(`No option with specified key ${option}`)
            printValue('Available options', availableOptions)
        }
    } else {
        printTip(config.path)
    }
}

export default changeConfig
