import chalk from 'chalk'
import inquirer from 'inquirer'
import downloadSubmitCode from './download.js'
import getSolveData from '../utils/getSolveData.js'
import { printError } from '../utils/messages.js'
import printTable, { handleSubmitStatus } from '../utils/printTable.js'
import { pageData, submitDetails } from '../lib/routes.js'
import { nextPageOption, previousPageOption, quitOption, downloadCodeOption, showSubmitDetailsOption } from '../lib/options.js'
import contestData from '../types/contestData.js'
import testObject from '../types/testObject.js'

const showSubmits = async (SessionId: string, contestId?: string, page: number = 1) => {
    const { submits, contest, submits_count }: contestData = await getSolveData(SessionId, pageData, contestId + '/' + page)
    const tableTitle = `Submits: ${chalk.cyanBright(contest.name)}`
    const submitsCount = Number(submits_count)
    const tableSuffix = `Page: ${page}/${Math.ceil(submitsCount / 15)}`
    const descriptionColumns = ['ID', 'Short Name', 'Status', 'Result', 'Time']
    const dataTemplate = ['id', 'problem_short_name', 'status', 'result', 'time']
    printTable(tableTitle, descriptionColumns, submits, dataTemplate, tableSuffix)
    const oldChoices = submits.map(({ id, status, problem_short_name }) => `${id} - ${handleSubmitStatus(status)} - ${problem_short_name}`)

    const additionalOptions = [quitOption]

    if (submitsCount - page * 15 > 0) {
        additionalOptions.push(nextPageOption)
    }
    if (page !== 1) {
        additionalOptions.push(previousPageOption)
    }

    const choices = [...oldChoices, new inquirer.Separator(), ...additionalOptions, new inquirer.Separator()]

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
                    showSubmitOptions(SessionId, option.split(' -')[0])
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
    const { tests, submit }: testObject = await getSolveData(SessionId, submitDetails, submitId)
    const compilationLog = submit.compilation_log
    const tableTitle = `Tests for ${chalk.cyanBright(submitId)}`
    const descriptionColumns = ['Test', 'Time', 'Memory', 'Status', 'Points', 'Comments']
    const dataTemplate = ['name', 'time', 'mem', 'status', 'points', 'comment']
    printTable(tableTitle, descriptionColumns, tests, dataTemplate)
    compilationLog ? console.log(compilationLog) : null
}

export const showLatestSubmit = async (SessionId: string, contestId: string) => {
    const { submits } = await getSolveData(SessionId, pageData, contestId + '/' + 1)
    submits?.length ? showSubmitDetails(SessionId, submits[0].id) : printError('No contest was found with ID:' + contestId)
}

export default showSubmits
