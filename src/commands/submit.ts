import Configstore from 'configstore'
import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import getSubmitDetails from '../utils/getSubmitDetails.js'
import getData from '../utils/getData.js'
import { table } from 'table'

type submitObject = {
    id: string
    problem_id: string
    status: string
    problem_short_name: string
    time: string
    result: string
}

type testObject = {
    name: string
    time: string
    status: string
    mem_limit: string
    mem: string
    max_points: string
    result: string
}

const handleSubmitStatus = (status: string) => {
    if (status === '<span class="badge badge-success">OK</span>') {
        return chalk.bgGreen.whiteBright(' OK ')
    } else if (status === '<span class="badge badge-important">Błędna odpowiedź</span>') {
        return chalk.bgRed.whiteBright(' WA ')
    } else if (status === '<span class="badge badge-warning">Limit czasu przekroczony</span>') {
        return chalk.bgHex('#ff7518').whiteBright(' TLE ')
    } else if (status === '<span class="badge badge-inverse">Naruszenie bezpieczeństwa</span>') {
        return chalk.bgBlack.whiteBright(' RV ')
    } else if (status === '<span class="badge badge-inverse">Błąd kompilacji</span>') {
        return chalk.bgBlackBright.whiteBright(' CE ')
    } else if (status === '<span class="badge badge-info">Błąd wykonania</span>') {
        return chalk.bgMagenta.whiteBright(' RE ')
    } else if (status == '') {
        return ''
    }
    return console.log(chalk.redBright(figures.cross), chalk.redBright('Error no contest badge found with status'), chalk.red(status))
}

const showSubmits = async (SessionId: string, contestId?: string) => {
    const { submits, contest } = await getData(SessionId, contestId)
    const contestName = contest.name

    const tableData = submits.map(({ id, problem_short_name, status, result, time }: submitObject) => {
        const submitStatus = handleSubmitStatus(status)
        const parsedTime = time.replace(/<.*?>/g, '')
        return [id, problem_short_name, submitStatus, result, parsedTime]
    })

    const tableTitle = [`Submits: ${chalk.cyanBright(contestName)}`, '', '', '', '']
    const descriptionColumns = ['ID', 'Short Name', 'Status', 'Result', 'Time']
    tableData.unshift(descriptionColumns)
    tableData.unshift(tableTitle)

    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: 5 }],
    }
    console.log(table(tableData, tableConfig))
    const choices = submits.map(({ id }) => id)

    const quitOption = `${chalk.red(figures.cross)} Quit`
    choices.push(quitOption)
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select submit',
                name: 'option',
                choices: choices,
            },
        ])
        .then(({ option }) => {
            if (option !== quitOption) {
                showSubmitDetails(SessionId, option)
            }
        })
}

const showSubmitDetails = async (SessionId: string, submitId: string) => {
    const { tests } = await getSubmitDetails(SessionId, submitId)

    const tableData = tests.map(({ name, time, mem, mem_limit, result, max_points, status }: testObject) => {
        const submitStatus = handleSubmitStatus(status)
        return [name, time.replace(/ /g, ''), mem ? `${mem}/${mem_limit}MB` : '', submitStatus, result ? `${result}/${max_points}` : '']
    })

    const tableTitle = [`Tests for ${chalk.cyanBright(submitId)}`, '', '', '', '']
    const descriptionColumns = ['Test', 'Time', 'Memory', 'Status', 'Points']
    tableData.unshift(descriptionColumns)
    tableData.unshift(tableTitle)

    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: 5 }],
    }

    console.log(table(tableData, tableConfig))
}

export const showLatestSubmit = async (SessionId: string, contestId: string) => {
    const { submits } = await getData(SessionId, contestId)
    showSubmitDetails(SessionId, submits[0].id)
}

export default showSubmits
