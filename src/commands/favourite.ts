import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import getSolveData from '../utils/getSolveData.js'
import isNotEmpty from '../utils/isNotEmpty.js'
import { contestData } from '../lib/routes.js'
import configType from '../types/configType.js'
import contestDataType from '../types/contestDataType.js'

const config = new Configstore('solve3-cli')

export const showFavouriteContests = () => {
    const favourites: configType['favourites'] = config.get('favourites')
    if (isNotEmpty(favourites)) {
        console.log(chalk.yellow(figures.star), chalk.cyan('Favourite contests'))
        for (const key in favourites) {
            console.log(chalk.cyan(favourites[key].id), ':', chalk.green(favourites[key].name))
        }
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright('Error: there are no favourites'))
    }
}

export const addFavouriteContest = async (SessionId: string, contestId: string) => {
    const favourites: configType['favourites'] = config.get('favourites')
    const { id, name }: contestDataType = await getSolveData(SessionId, contestData, contestId)
    if (id) {
        favourites[contestId] = { id, name }
        config.set('favourites', favourites)
        console.log(chalk.greenBright(figures.tick), chalk.cyan(name), chalk.green('has been added to your favourites!'))
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright(`Contest with ID: ${contestId} doesn't exist`))
    }
}

export const deleteFavouriteContest = (contestId: string) => {
    const favourites: configType['favourites'] = config.get('favourites')
    if (favourites[contestId]) {
        const contestName = favourites[contestId].name
        delete favourites[contestId]
        config.set('favourites', favourites)
        console.log(chalk.greenBright(figures.tick), chalk.cyan(contestName), chalk.green('has been'), chalk.red('DELETED'), chalk.green('from your favourites!'))
    } else {
        console.log(chalk.red(figures.cross), chalk.redBright("Favourite contest with that id doesn't exists"))
    }
}
