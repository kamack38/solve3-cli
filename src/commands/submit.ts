import chalk from 'chalk'
import figures from 'figures'
import inquirer from 'inquirer'
import { table } from 'table'
import downloadSubmitCode from './download.js'
import getSolveData from '../utils/getSolveData.js'
import { printError, printInfo, printSuccess, printTip } from '../utils/messages.js'
import { pageData, submitDetails } from '../lib/routes.js'
import { nextPageOption, previousPageOption, quitOption, downloadCodeOption, showSubmitDetailsOption } from '../lib/options.js'

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
    points: string
    comment: string
}

const handleSubmitStatus = (status: string) => {
    switch (status) {
        case '<span class="badge badge-success">OK</span>':
            return chalk.bgGreen.whiteBright(' OK ')
        case '<span class="badge badge-important">Błędna odpowiedź</span>':
            return chalk.bgRed.whiteBright(' WA ')
        case '<span class="badge badge-warning">Limit czasu przekroczony</span>':
            return chalk.bgHex('#ff7518').whiteBright(' TLE ')
        case '<span class="badge badge-inverse">Naruszenie bezpieczeństwa</span>':
            return chalk.bgBlack.whiteBright(' RV ')
        case '<span class="badge badge-inverse">Błąd kompilacji</span>':
            return chalk.bgBlackBright.whiteBright(' CE ')
        case '<span class="badge badge-info">Błąd wykonania</span>':
            return chalk.bgMagenta.whiteBright(' RE ')
        case '<span class="badge">?</span>':
            return chalk.bgYellow.blackBright(' ? ')
        case '':
            return ''
    }
    printError('Error no contest badge found with status: ' + status)
}

const showSubmits = async (SessionId: string, contestId?: string, page: number = 1) => {
    const { submits, contest, submits_count } = await getSolveData(SessionId, pageData, contestId, page)
    const contestName = contest.name
    const submitsCount = Number(submits_count)

    const tableData = submits.map(({ id, problem_short_name, status, result, time }: submitObject) => {
        const submitStatus = handleSubmitStatus(status)
        const parsedTime = time.replace(/<.*?>/g, '')
        return [id, problem_short_name, submitStatus, result, parsedTime]
    })

    const tableTitle = [`Submits: ${chalk.cyanBright(contestName)}`, '', '', '', `Page: ${page}/${Math.ceil(submitsCount / 15)}`]
    const descriptionColumns = ['ID', 'Short Name', 'Status', 'Result', 'Time']
    tableData.unshift(descriptionColumns)
    tableData.unshift(tableTitle)

    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: 4 }],
    }
    console.log(table(tableData, tableConfig))
    const choices = submits.map(({ id }) => id)

    const additionalOptions = [quitOption]

    if (submitsCount - page * 15 > 0) {
        additionalOptions.push(nextPageOption)
    }
    if (page !== 1) {
        additionalOptions.push(previousPageOption)
    }

    choices.push(new inquirer.Separator(), ...additionalOptions, new inquirer.Separator())

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
            switch (option) {
                case nextPageOption:
                    showSubmits(SessionId, contestId, page + 1)
                    break
                case previousPageOption:
                    showSubmits(SessionId, contestId, page - 1)
                    break
                case quitOption:
                    break
                default:
                    showSubmitOptions(SessionId, option)
                    break
            }
        })
}

const showSubmitOptions = (SessionId: string, submitId: string) => {
    const choices = [showSubmitDetailsOption, downloadCodeOption]
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
            },
        ])
        .then(({ option }) => {
            switch (option) {
                case downloadCodeOption:
                    downloadSubmitCode(SessionId, submitId)
                    break
                case showSubmitDetailsOption:
                    showSubmitDetails(SessionId, submitId)
                    break
            }
        })
}

const showSubmitDetails = async (SessionId: string, submitId: string) => {
    const { tests, submit } = await getSolveData(SessionId, submitDetails, submitId)
    const compilationLog = submit.compilation_log
    const tableData = tests.map(({ name, time, mem, mem_limit, points, status, comment }: testObject) => {
        const submitStatus = handleSubmitStatus(status)
        return [name, time.replace(/ /g, ''), mem ? `${mem}/${mem_limit}MB` : '', submitStatus, points, comment.replace(/ +/g, ' ').replace('Å‚', 'ł')]
    })

    const tableTitle = [`Tests for ${chalk.cyanBright(submitId)}`, '', '', '', '', '']
    const descriptionColumns = ['Test', 'Time', 'Memory', 'Status', 'Points', 'Comments']
    tableData.unshift(descriptionColumns)
    tableData.unshift(tableTitle)

    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: 6 }],
    }

    console.log(table(tableData, tableConfig))
    compilationLog ? console.log(compilationLog) : null
}

export const showLatestSubmit = async (SessionId: string, contestId: string) => {
    const { submits } = await getSolveData(SessionId, pageData, contestId, 1)
    submits?.length ? showSubmitDetails(SessionId, submits[0].id) : printError('No contest was found with ID:' + contestId)
}

export default showSubmits
