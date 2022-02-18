import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import axios from 'axios'
import getContestData from '../utils/getContestData.js'
import showProblems from './send.js'
import showRanking from './ranking.js'
import getData from '../utils/getData.js'

const config = new Configstore('solve3-cli')

const getContests = async (SessionId: string, contestId: string = '0') => {
    return axios
        .get(`https://solve.edu.pl/contests/get_list?param=${contestId}`, {
            headers: {
                Cookie: `PHPSESSID=${SessionId};`,
            },
        })
        .then((res) => {
            return res.data.records
        })
        .catch((error) => {
            console.log(chalk.redBright(figures.cross), error)
        })
}

const checkParentId = async (SessionId: string, contestId: string) => {
    if (contestId !== '0' && contestId !== undefined) {
        const contestData = await getData(SessionId, contestId)
        return contestData
    }
    return null
}

const selectContest = async (SessionId: string, contestId?: string) => {
    const contestsArr = await getContests(SessionId, contestId)
    if (!contestsArr.length) {
        showContestInfo(SessionId, contestId)
    } else {
        const favorites = config.get('favorites')
        if (favorites?.length) {
            contestsArr.unshift(new inquirer.Separator())
            favorites.forEach(({ name, id }) => {
                contestsArr.unshift({ name: `${chalk.yellow(figures.star)} ` + name, id })
            })
        }
        const contestData = await checkParentId(SessionId, contestId)
        if (contestData) {
            contestsArr.unshift(new inquirer.Separator())
            contestsArr.unshift(figures.triangleUp)
        }
        const defaultSelect = contestData?.contest ? 2 : 0 + favorites.length
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select contest',
                    name: 'selectedContest',
                    choices: contestsArr,
                    loop: false,
                    pageSize: 10,
                    default: defaultSelect,
                },
            ])
            .then(({ selectedContest }) => {
                if (figures.triangleUp === selectedContest) {
                    selectContest(SessionId, contestData.contest.parent)
                } else {
                    const contestInfo = contestsArr.find(({ name }) => name === selectedContest.replace(`${figures.star} `, ''))
                    selectContest(SessionId, contestInfo.id)
                }
            })
    }
}

const showContestInfo = async (SessionId: string, contestId?: string) => {
    const contestData = await getContestData(SessionId, contestId)
    console.log(chalk.blue(figures.info), chalk.cyan('Contest Info'))
    console.log(chalk.cyan('Name'), ':', chalk.green(contestData.name))
    console.log(chalk.cyan('ID'), ':', chalk.green(contestData.id))
    console.log(chalk.cyan('Parent ID'), ':', chalk.green(contestData.parent))
    console.log(chalk.cyan('Short name'), ':', chalk.green(contestData.short_name))
    const choices = ['❓ Show problems', '📊 Show ranking', `${chalk.red(figures.cross)} Quit`]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
                loop: false,
            },
        ])
        .then(({ option }) => {
            if (option === '❓ Show problems') {
                showProblems(SessionId, contestData.id)
            } else if (option === '📊 Show ranking') {
                showRanking(SessionId, contestData.id)
            }
        })
}

export default selectContest
