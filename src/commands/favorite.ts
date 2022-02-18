import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import getContestData from '../utils/getContestData.js'
import isNotEmpty from '../utils/isNotEmpty.js'

const config = new Configstore('solve3-cli')

export const showFavoriteContests = async (SessionId: string) => {
    const favorites = config.get('favorites')
    if (isNotEmpty(favorites)) {
        console.log(chalk.yellow(figures.star), chalk.cyan('Favorite contests'))
        for (const key in favorites) {
            console.log(chalk.cyan(favorites[key].id), ':', chalk.green(favorites[key].name))
        }
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright('Error: there are no favorites'))
    }
}

export const addFavoriteContest = async (SessionId: string, contestId: string) => {
    const favorites = config.get('favorites')
    const { id, name } = await getContestData(SessionId, contestId)
    if (id) {
        favorites[contestId] = { id, name }
        config.set('favorites', favorites)
        console.log(chalk.greenBright(figures.tick), chalk.cyan(name), chalk.green('has been added to your favorites!'))
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright(`Contest with ID: ${contestId} doesn't exist`))
    }
}

export const deleteFavoriteContest = async (contestId: string) => {
    const favorites = config.get('favorites')
    if (favorites[contestId]) {
        const contestName = favorites[contestId].name
        delete favorites[contestId]
        console.log(favorites)
        config.set('favorites', favorites)
        console.log(chalk.greenBright(figures.tick), chalk.cyan(contestName), chalk.green('has been'), chalk.red('DELETED'), chalk.green('from your favorites!'))
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright("Favorite with that id doesn't exists"))
    }
}
