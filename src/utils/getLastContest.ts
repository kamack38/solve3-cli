import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'

const config = new Configstore('solve3-cli')

const getLastContest = () => {
    const lastContest = config.get('lastContest')
    if (!lastContest) {
        console.log(chalk.red(figures.cross), chalk.redBright('Last contest was not found!'))
        return undefined
    } else {
        return lastContest
    }
}

export default getLastContest
