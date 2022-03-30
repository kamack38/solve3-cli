import chalk from 'chalk'
import inquirer from 'inquirer'
import downloadSubmitCode from './download.js'
import getSolveData from '../utils/getSolveData.js'
import { printError } from '../utils/messages.js'
import printTable, { handleSubmitStatus } from '../utils/printTable.js'
import handlePagination from '../utils/handlePagination.js'
import { pageData, submitDetails } from '../lib/routes.js'
import { nextPageOption, previousPageOption, quitOption, downloadCodeOption, showSubmissionDetailsOption } from '../lib/options.js'
import contestType from '../types/contestType.js'
import testObject from '../types/testObject.js'

const showSubmissions = async (SessionId: string, contestId?: string, page = 1) => {
    const { submits, contest, submits_count }: contestType = await getSolveData(SessionId, pageData, contestId + '/' + page)
    const tableTitle = `Submits: ${chalk.cyanBright(contest.name)}`
    const submitsCount = Number(submits_count)
    const tableSuffix = `Page: ${page}/${Math.ceil(submitsCount / 15)}`
    const descriptionColumns = ['ID', 'Short Name', 'Status', 'Result', 'Time']
    const dataTemplate = ['id', 'problem_short_name', 'status', 'result', 'time']
    printTable(tableTitle, descriptionColumns, submits, dataTemplate, tableSuffix)
    const oldChoices = submits.map(({ id, status, problem_short_name }) => {
        return { name: `${id} - ${handleSubmitStatus(status)} - ${problem_short_name}`, value: id }
    })

    const choices = [...oldChoices, ...handlePagination(page, Math.ceil(submitsCount / 15))]

    await inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select submit',
                name: 'option',
                choices: choices,
            },
        ])
        .then(async ({ option }: { option: string }) => {
            switch (option) {
                case nextPageOption:
                    return await showSubmissions(SessionId, contestId, page + 1)
                case previousPageOption:
                    return await showSubmissions(SessionId, contestId, page - 1)
                case quitOption:
                    return
                default:
                    return await showSubmissionOptions(SessionId, option)
            }
        })
}

const showSubmissionOptions = async (SessionId: string, submitId: string) => {
    const choices = [showSubmissionDetailsOption, downloadCodeOption]
    await inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select option',
                name: 'option',
                choices: choices,
            },
        ])
        .then(async ({ option }: { option: string }) => {
            switch (option) {
                case downloadCodeOption:
                    return await downloadSubmitCode(SessionId, submitId)
                case showSubmissionDetailsOption:
                    return await showSubmissionDetails(SessionId, submitId)
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
    const { submits }: contestType = await getSolveData(SessionId, pageData, contestId + '/' + 1)
    submits?.length ? showSubmissionDetails(SessionId, submits[0].id) : printError('No contest was found with ID:' + contestId)
}

export default showSubmissions
