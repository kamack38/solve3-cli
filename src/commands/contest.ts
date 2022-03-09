import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import showProblems from './send.js'
import showRanking from './ranking.js'
import showSubmits from './submit.js'
import isNotEmpty from '../utils/isNotEmpty.js'
import getSolveData from '../utils/getSolveData.js'
import { printInfo, printSuccess, printTip } from '../utils/messages.js'
import { contests, contestData, pageData } from '../lib/routes.js'
import { problemsOption, submitsOption, rankingOption, afterTimeRankingOption, favoriteAddOption, favoriteRemoveOption, backOption, quitOption } from '../lib/options.js'

const config = new Configstore('solve3-cli')

const checkParentId = async (SessionId: string, contestId: string) => {
    if (contestId !== '0' && contestId !== undefined) {
        return await getSolveData(SessionId, pageData, contestId + '/' + 1)
    }
}

const selectContest = async (SessionId: string, contestId: string = '0') => {
    const { records: contestsArr } = await getSolveData(SessionId, contests, contestId)
    if (!contestsArr.length) {
        showContestInfo(SessionId, contestId)
    } else {
        const favorites = config.get('favorites')
        if (isNotEmpty(favorites)) {
            contestsArr.unshift(new inquirer.Separator())
            for (const key in favorites) {
                contestsArr.unshift({ name: `${chalk.yellow(figures.star)} ` + favorites[key].name, id: favorites[key].id })
            }
        }
        const contestData = await checkParentId(SessionId, contestId)
        let defaultSelect = 0
        if (contestData) {
            contestsArr.unshift(new inquirer.Separator())
            contestsArr.unshift(figures.triangleUp)
            defaultSelect += 1
        }
        defaultSelect += Object.keys(favorites).length
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select contest',
                    name: 'selectedContest',
                    choices: contestsArr,
                    loop: false,
                    pageSize: 14,
                    default: defaultSelect,
                },
            ])
            .then(({ selectedContest }) => {
                if (figures.triangleUp === selectedContest) {
                    selectContest(SessionId, contestData.contest.parent)
                } else if (favorites[selectedContest]) {
                    config.set('lastContest', favorites[selectedContest].id)
                    selectContest(SessionId, favorites[selectedContest].id)
                } else {
                    const contestInfo = contestsArr.find(({ name }) => name === selectedContest.replace(`${figures.star} `, ''))
                    config.set('lastContest', contestInfo.id)
                    selectContest(SessionId, contestInfo.id)
                }
            })
    }
}

const printTime = (endTime: string) => {
    const timeDiff = Math.floor(new Date(endTime).getTime() / 1000) - Math.floor(new Date().getTime() / 1000)
    switch (true) {
        case timeDiff < 0:
            return 'Contest ended'
        case timeDiff > 24 * 3600:
            return Math.floor(timeDiff / (24 * 3600)) + ' d'
        default:
            return new Date(timeDiff).toLocaleTimeString()
    }
}

const showContestInfo = async (SessionId: string, contestId?: string) => {
    const { name, id, parent, short_name, end_time } = await getSolveData(SessionId, contestData, contestId)
    printTip('Contest Info')
    printInfo('Name', name)
    printInfo('ID', id)
    printInfo('Parent ID', parent)
    printInfo('Short name', short_name)
    printInfo('Time left', printTime(end_time))

    const favorites = config.get('favorites')
    const favoriteOption = favorites[contestId] ? favoriteRemoveOption : favoriteAddOption
    const choices = [backOption, problemsOption, rankingOption, afterTimeRankingOption, submitsOption, favoriteOption, quitOption]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: true,
            },
        ])
        .then(({ option }) => {
            switch (option) {
                case backOption:
                    selectContest(SessionId, parent)
                    break
                case problemsOption:
                    showProblems(SessionId, id)
                    break
                case rankingOption:
                    showRanking(SessionId, id)
                    break
                case afterTimeRankingOption:
                    showRanking(SessionId, id, true)
                    break
                case submitsOption:
                    showSubmits(SessionId, id)
                    break
                case favoriteOption:
                    if (favoriteOption === favoriteAddOption) {
                        favorites[contestId] = { name: name, id: contestId }
                        config.set('favorites', favorites)
                    } else {
                        delete favorites[contestId]
                        config.set('favorites', favorites)
                    }
                    printSuccess('Favorites has been updated!')
            }
        })
}

export default selectContest
