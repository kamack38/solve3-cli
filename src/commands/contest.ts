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
import handlePagination from '../utils/handlePagination.js'
import { contests, contestData as contestDataRoute, pageData } from '../lib/routes.js'
import {
    problemsOption,
    submissionsOption,
    rankingOption,
    afterTimeRankingOption,
    favouriteAddOption,
    favouriteRemoveOption,
    backOption,
    quitOption,
    nextPageOption,
    previousPageOption,
} from '../lib/options.js'

const config = new Configstore('solve3-cli')

const checkParentId = async (SessionId: string, contestId: string) => {
    if (contestId !== '0' && contestId !== undefined) {
        return await getSolveData(SessionId, pageData, contestId + '/' + 1)
    }
}

const selectContest = async (SessionId: string, contestId: string = '0', onlyAvailable: boolean = false, page: number = 1) => {
    let { records: contestsArr, total_pages } = await getSolveData(SessionId, contests, contestId, { page })
    if (!contestsArr.length) {
        showContestInfo(SessionId, contestId)
    } else {
        if (onlyAvailable) {
            contestsArr = contestsArr.filter(({ permission }) => permission === '<span class="badge badge-success">Tak</span>')
        }
        const favourites = config.get('favourites')
        if (isNotEmpty(favourites)) {
            contestsArr.unshift(new inquirer.Separator())
            for (const key in favourites) {
                contestsArr.unshift({ name: `${chalk.yellow(figures.star)} ` + favourites[key].name, id: favourites[key].id })
            }
        }
        const contestData = await checkParentId(SessionId, contestId)
        let defaultSelect = 0
        if (contestData) {
            contestsArr.unshift(backOption, new inquirer.Separator())
            defaultSelect += 1
        }
        contestsArr.push(...handlePagination(page, total_pages - 1))
        defaultSelect += Object.keys(favourites).length
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select contest',
                    name: 'selectedContest',
                    choices: contestsArr,
                    loop: true,
                    pageSize: 14,
                    default: defaultSelect,
                },
            ])
            .then(({ selectedContest }) => {
                switch (true) {
                    case selectedContest === nextPageOption:
                        selectContest(SessionId, contestId, onlyAvailable, page + 1)
                        break
                    case selectedContest === previousPageOption:
                        selectContest(SessionId, contestId, onlyAvailable, page - 1)
                        break
                    case selectedContest === backOption:
                        selectContest(SessionId, contestData.contest.parent, onlyAvailable)
                        break
                    case selectedContest === quitOption:
                        break
                    case favourites[selectedContest]:
                        config.set('lastContest', favourites[selectedContest].id)
                        selectContest(SessionId, favourites[selectedContest].id, onlyAvailable)
                        break
                    default:
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

    const favourites = config.get('favourites')
    const favouriteOption = favourites[contestId] ? favouriteRemoveOption : favouriteAddOption
    const choices = [backOption, problemsOption, rankingOption, afterTimeRankingOption, submissionsOption, favouriteOption, quitOption]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: true,
                default: 1,
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
                case favouriteOption:
                    if (favouriteOption === favouriteAddOption) {
                        favourites[contestId] = { name: name, id: contestId }
                        config.set('favourites', favourites)
                    } else {
                        delete favourites[contestId]
                        config.set('favourites', favourites)
                    }
                    printSuccess('Favourites has been updated!')
            }
        })
}

export default selectContest
