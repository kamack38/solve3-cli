import chalk from 'chalk'
import figures from 'figures'

export const printInfo = (label: string, value: string) => {
    console.log(chalk.cyan(label), ':', chalk.green(value))
}

export const printTip = (message: string) => {
    console.log(chalk.blue(figures.info), chalk.cyan(message))
}

export const printError = (error: string) => {
    console.log(chalk.red(figures.cross), chalk.redBright(error))
}

export const printSuccess = (message: string) => {
    console.log(chalk.green(figures.tick), chalk.greenBright(message))
}
