import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import showProblems from './send.js'
import showRanking from './ranking.js'
import showSubmissions from './submission.js'
import isNotEmpty from '../utils/isNotEmpty.js'
import getSolveData from '../utils/getSolveData.js'
import { printInfo, printSuccess, printTip } from '../utils/messages.js'
import { contests, contestData as contestDataRoute, pageData } from '../lib/routes.js'
import { problemsOption, submissionsOption, rankingOption, afterTimeRankingOption, favoriteAddOption, favoriteRemoveOption, backOption, quitOption } from '../lib/options.js'

const config = new Configstore('solve3-cli')

const checkParentId = async (SessionId: string, contestId: string) => {
    if (contestId !== '0' && contestId !== undefined) {
        return await getSolveData(SessionId, pageData, contestId + '/' + 1)
    }
}

const selectContest = async (SessionId: string, contestId: string = '0', onlyAvailable: boolean = false) => {
    let { records: contestsArr } = await getSolveData(SessionId, contests, contestId)
    if (!contestsArr.length) {
        showContestInfo(SessionId, contestId)
    } else {
        if (onlyAvailable) {
            contestsArr = contestsArr.filter(({ permission }) => permission === '<span class="badge badge-success">Tak</span>')
        }
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
            contestsArr.unshift(backOption)
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
                if (selectedContest === backOption) {
                    selectContest(SessionId, contestData.contest.parent, onlyAvailable)
                } else if (favorites[selectedContest]) {
                    config.set('lastContest', favorites[selectedContest].id)
                    selectContest(SessionId, favorites[selectedContest].id, onlyAvailable)
                } else {
                    const contestInfo = contestsArr.find(({ name }) => name === selectedContest.replace(`${figures.star} `, ''))
                    config.set('lastContest', contestInfo.id)
                    selectContest(SessionId, contestInfo.id, onlyAvailable)
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
    const { name, id, parent, short_name, end_time } = await getSolveData(SessionId, contestDataRoute, contestId)
    printTip('Contest Info')
    printInfo('Name', name)
    printInfo('ID', id)
    printInfo('Parent ID', parent)
    printInfo('Short name', short_name)
    printInfo('Time left', printTime(end_time))

    const favorites = config.get('favorites')
    const favoriteOption = favorites[contestId] ? favoriteRemoveOption : favoriteAddOption
    const choices = [backOption, problemsOption, rankingOption, afterTimeRankingOption, submissionsOption, favoriteOption, quitOption]
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
                case submissionsOption:
                    showSubmissions(SessionId, id)
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
