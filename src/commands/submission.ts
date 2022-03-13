import chalk from 'chalk'
import inquirer from 'inquirer'
import downloadSubmitCode from './download.js'
import getSolveData from '../utils/getSolveData.js'
import { printError } from '../utils/messages.js'
import printTable, { handleSubmitStatus } from '../utils/printTable.js'
import handlePagination from '../utils/handlePagination.js'
import { pageData, submitDetails } from '../lib/routes.js'
import { nextPageOption, previousPageOption, quitOption, downloadCodeOption, showSubmissionDetailsOption } from '../lib/options.js'
import contestData from '../types/contestData.js'
import testObject from '../types/testObject.js'

const showSubmissions = async (SessionId: string, contestId?: string, page: number = 1) => {
    const { submits, contest, submits_count }: contestData = await getSolveData(SessionId, pageData, contestId + '/' + page)
    const tableTitle = `Submits: ${chalk.cyanBright(contest.name)}`
    const submitsCount = Number(submits_count)
    const tableSuffix = `Page: ${page}/${Math.ceil(submitsCount / 15)}`
    const descriptionColumns = ['ID', 'Short Name', 'Status', 'Result', 'Time']
    const dataTemplate = ['id', 'problem_short_name', 'status', 'result', 'time']
    printTable(tableTitle, descriptionColumns, submits, dataTemplate, tableSuffix)
    const oldChoices = submits.map(({ id, status, problem_short_name }) => `${id} - ${handleSubmitStatus(status)} - ${problem_short_name}`)

    const choices = [...oldChoices, ...handlePagination(page, Math.ceil(submitsCount / 15))]

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
                    showSubmissions(SessionId, contestId, page + 1)
                    break
                case previousPageOption:
                    showSubmissions(SessionId, contestId, page - 1)
                    break
                case quitOption:
                    break
                default:
                    showSubmissionOptions(SessionId, option.split(' -')[0])
                    break
            }
        })
}

const showSubmissionOptions = (SessionId: string, submitId: string) => {
    const choices = [showSubmissionDetailsOption, downloadCodeOption]
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
                case showSubmissionDetailsOption:
                    showSubmissionDetails(SessionId, submitId)
                    break
            }
        })
}

const showSubmissionDetails = async (SessionId: string, submitId: string) => {
    const { tests, submit }: testObject = await getSolveData(SessionId, submitDetails, submitId)
    const compilationLog = submit.compilation_log
    const tableTitle = `Tests for ${chalk.cyanBright(submitId)}`
    const descriptionColumns = ['Test', 'Time', 'Memory', 'Status', 'Points', 'Comments']
    const dataTemplate = ['name', 'time', 'mem', 'status', 'points', 'comment']
    printTable(tableTitle, descriptionColumns, tests, dataTemplate)
    compilationLog ? console.log(compilationLog) : null
}

export const showLatestSubmission = async (SessionId: string, contestId: string) => {
    const { submits } = await getSolveData(SessionId, pageData, contestId + '/' + 1)
    submits?.length ? showSubmissionDetails(SessionId, submits[0].id) : printError('No contest was found with ID:' + contestId)
}

export default showSubmissions
