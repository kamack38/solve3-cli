import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'

const config = new Configstore('solve3-cli')

const getSessionId = () => {
    const authCookie = config.get('authCookie')
    if (!authCookie) {
        console.log(chalk.red(figures.cross), chalk.redBright(`Authentication cookie was not found!`))
        console.log(chalk.blue(figures.info), chalk.cyan(`Use login command to authenticate`))
        return undefined
    } else {
        return authCookie
    }
}

export default getSessionId
