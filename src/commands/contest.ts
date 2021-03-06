import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import showProblems from './send.js'
import showRanking from './ranking.js'
import showSubmissions from './submission.js'
import isNotEmpty from '../utils/isNotEmpty.js'
import getSolveData from '../utils/getSolveData.js'
import { printError, printInfo, printSuccess, printTip } from '../utils/messages.js'
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
    showQuestionsOption,
    askQuestionOption,
} from '../lib/options.js'
import showQuestions, { askQuestion } from './question.js'
import contestsArray from '../types/contestsObject.js'
import contestType from '../types/contestType.js'
import contestDataType from '../types/contestDataType.js'
import configType from '../types/configType.js'

const config = new Configstore('solve3-cli')

const selectContest = async (SessionId: string, contestId = '0', onlyAvailable = false, page = 1, live = false) => {
    const res: contestsArray = await getSolveData(SessionId, contests, contestId, { page })
    if (!res) {
        printError('This is NOT available!')
        return
    }

    let { records: contestsArr } = res
    const { total_pages } = res
    if (!contestsArr.length) {
        showContestInfo(SessionId, contestId, onlyAvailable, live)
        return
    }

    if (onlyAvailable) {
        contestsArr = contestsArr.filter(({ permission }) => permission === '<span class="badge badge-success">Tak</span>')
    }

    const separator = new inquirer.Separator()

    const favourites: configType['favourites'] = config.get('favourites')
    const choices: ({ name: string; value: string } | string | typeof separator)[] = contestsArr.map(({ name, id }) => {
        return { name, value: id }
    })

    if (isNotEmpty(favourites)) {
        choices.unshift(separator)
        for (const key in favourites) {
            choices.unshift({ name: `${chalk.yellow(figures.star)} ` + favourites[key].name, value: favourites[key].id })
        }
    }

    let defaultSelect = 0
    if (contestId !== '0' && contestId !== undefined) {
        choices.unshift(backOption, separator)
        defaultSelect += 1
    }
    choices.push(...handlePagination(page, total_pages - 1))
    defaultSelect += Object.keys(favourites).length
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select contest',
                name: 'selectedContest',
                choices: choices,
                loop: true,
                pageSize: 14,
                default: defaultSelect,
            },
        ])
        .then(async ({ selectedContest }: { selectedContest: string }) => {
            switch (true) {
                case selectedContest === nextPageOption:
                    selectContest(SessionId, contestId, onlyAvailable, page + 1, live)
                    break
                case selectedContest === previousPageOption:
                    selectContest(SessionId, contestId, onlyAvailable, page - 1, live)
                    break
                case selectedContest === backOption: {
                    const contestData: contestType = await getSolveData(SessionId, pageData, contestId + '/' + 1)
                    selectContest(SessionId, contestData.contest.parent, onlyAvailable, 1, live)
                    break
                }
                case selectedContest === quitOption:
                    break
                default:
                    config.set('lastContest', selectedContest)
                    selectContest(SessionId, selectedContest, onlyAvailable, 1, live)
            }
        })
}

const printTime = (endTime: string) => {
    const timeDiff = Math.floor((new Date(endTime).getTime() - new Date().getTime()) / 1000 + new Date().getTimezoneOffset() * 60)
    switch (true) {
        case timeDiff < 0:
            return 'Contest ended'
        case timeDiff > 24 * 3600:
            return Math.floor(timeDiff / (24 * 3600)) + ' d'
        default:
            return new Date(timeDiff).toLocaleTimeString()
    }
}

const showContestInfo = async (SessionId: string, contestId: string, onlyAvailable: boolean, live: boolean) => {
    const { name, id, parent, short_name, end_time }: contestDataType = await getSolveData(SessionId, contestDataRoute, contestId)
    printTip('Contest Info')
    printInfo('Name', name)
    printInfo('ID', id)
    printInfo('Parent ID', parent)
    printInfo('Short name', short_name)
    printInfo('Time left', printTime(end_time))

    const favourites: configType['favourites'] = config.get('favourites')
    const favouriteOption = favourites[contestId] ? favouriteRemoveOption : favouriteAddOption
    const choices = [backOption, problemsOption, rankingOption, afterTimeRankingOption, submissionsOption, showQuestionsOption, askQuestionOption, favouriteOption, quitOption]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: true,
                pageSize: 9,
                default: 1,
            },
        ])
        .then(async ({ option }: { option: string }) => {
            switch (option) {
                case quitOption:
                    return
                case backOption:
                    selectContest(SessionId, parent, onlyAvailable, 1, live)
                    return
                case problemsOption:
                    await showProblems(SessionId, id)
                    break
                case rankingOption:
                    await showRanking(SessionId, id)
                    break
                case afterTimeRankingOption:
                    await showRanking(SessionId, id, true)
                    break
                case submissionsOption:
                    await showSubmissions(SessionId, id)
                    break
                case showQuestionsOption:
                    await showQuestions(SessionId, id)
                    break
                case askQuestionOption:
                    await askQuestion(SessionId, id)
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
            if (live) {
                showContestInfo(SessionId, contestId, onlyAvailable, live)
            }
        })
}

export default selectContest
