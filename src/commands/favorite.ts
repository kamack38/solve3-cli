import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import getContestData from '../utils/getContestData.js'

const config = new Configstore('solve3-cli')

export const showFavoriteContests = async (SessionId: string) => {
    const favorites = config.get('favorites')
    if (favorites?.length) {
        console.log(chalk.yellow(figures.star), chalk.cyan('Favorite contests'))
        favorites.forEach(({ id, name }) => {
            console.log(chalk.cyan(id), ':', chalk.green(name))
        })
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright('Error: there are no favorites'))
    }
}

export const addFavoriteContest = async (SessionId: string, contestId: string) => {
    const favorites = config.get('favorites')
    const { id, name } = await getContestData(SessionId, contestId)
    favorites.push({ id, name })
    config.set('favorites', favorites)
}

export const deleteFavoriteContest = async (contestId: string) => {
    const favorites = config.get('favorites')
    const newFavorites = favorites.filter(({ id }) => id !== contestId)
    config.set('favorites', newFavorites)
}
