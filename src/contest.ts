import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import axios from 'axios'
import getContestData from './utils/getContestData.js'
import showProblems from './send.js'

const getContests = async (PHPSessionId: string, id: string = '0') => {
    return axios
        .get(`https://solve.edu.pl/contests/get_list?param=${id}`, {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        })
        .then((res) => {
            return res.data.records
        })
        .catch((error) => {
            console.log(chalk.redBright(figures.cross), error)
        })
}

const selectContest = async (PHPSessionId: string, id?: string) => {
    const contestsArr = await getContests(PHPSessionId, id)
    if (!contestsArr.length) {
        showContestInfo(PHPSessionId, id)
    } else {
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Select contest',
                    name: 'contest',
                    choices: contestsArr,
                    loop: false,
                    pageSize: 10,
                },
            ])
            .then(({ contest }) => {
                const contestInfo = contestsArr.find(({ name }) => name === contest)
                selectContest(PHPSessionId, contestInfo.id)
            })
    }
}

const showContestInfo = async (PHPSessionId: string, id?: string) => {
    const contestData = await getContestData(PHPSessionId, id)
    console.log(chalk.blue(figures.info), chalk.cyan('Contest Info'))
    console.log(chalk.cyan('Name'), ':', chalk.green(contestData.name))
    console.log(chalk.cyan('ID'), ':', chalk.green(contestData.id))
    console.log(chalk.cyan('Parent ID'), ':', chalk.green(contestData.parent))
    console.log(chalk.cyan('Short name'), ':', chalk.green(contestData.short_name))
    const choices = ['Show problems', 'Quit']
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
            if (option === 'Show problems') {
                showProblems(PHPSessionId, contestData.id)
            }
        })
}

export default selectContest
