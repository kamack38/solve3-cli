import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import { printInfo, printError, printTip } from '../utils/messages.js'

const config = new Configstore('solve3-cli')

const changeConfig = (option: string, value: string) => {
    if (option) {
        if (config.has(option)) {
            if (value) {
                config.set(option, value)
                printInfo(option, value)
            } else {
                const val = config.get(option)
                console.log(chalk.blue(figures.info), chalk.cyan(option), ':', chalk.green(JSON.stringify(val, null, 2)))
            }
        } else {
            const availableOptions = Object.keys(config.all).toString().replace(/,/g, ', ')
            printError(`No option with specified key ${option}`)
            printTip(`Available options: ${availableOptions}`)
        }
    } else {
        printTip(config.path)
    }
}

export default changeConfig
