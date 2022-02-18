import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'

const config = new Configstore('solve3-cli')

const changeConfig = (option: string, value: string) => {
    if (option) {
        if (config.has(option)) {
            if (value) {
                config.set(option, value)
                console.log(chalk.green(figures.tick), chalk.cyan(option), ':', chalk.green(value))
            } else {
                const val = config.get(option)
                console.log(chalk.blue(figures.info), chalk.cyan(option), ':', chalk.green(val))
            }
        } else {
            const availableOptions = Object.keys(config.all).toString().replace(/,/g, ', ')
            console.log(chalk.red(figures.cross), chalk.redBright(`No option with specified key ${option}`))
            console.log(chalk.blue(figures.info), chalk.cyan(`Available options: ${availableOptions}`))
        }
    } else {
        console.log(chalk.blue(figures.info), chalk.cyan(config.path))
    }
}

export default changeConfig
