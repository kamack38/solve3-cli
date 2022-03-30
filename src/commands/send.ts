import inquirer from 'inquirer'
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'
import { lstatSync, PathLike } from 'node:fs'
import { extname } from 'node:path'
import showProblemDescription from './description.js'
import getSolveData from '../utils/getSolveData.js'
import postSolveData, { createSubmitData } from '../utils/postSolveData.js'
import { printInfo, printError, printSuccess, printTip, printValue } from '../utils/messages.js'
import { contestSubmit, pageData } from '../lib/routes.js'
import { sendSolutionOption, descriptionOption, quitOption } from '../lib/options.js'
import { handleSubmitStatus } from '../utils/printTable.js'
import problemObjectType from '../types/problemObject.js'
import contestType from '../types/contestType.js'
import ArrayElement from '../types/ArrayElement.js'
import type FormData from 'form-data'

export const send = async (SessionId: string, route: string, sendData: FormData, resUrl: string) => {
    postSolveData(SessionId, route, sendData)
        .then((res) => {
            const responseUrl: string = res.request.res.responseUrl
            if (responseUrl === resUrl) {
                printSuccess('File has been successfully sent!')
            } else {
                printError('Error while sending the file')
            }
        })
        .catch((error: Error) => {
            printError(error.message)
        })
}

const sendContestSolution = async (SessionId: string, problemShortName: string, id: string, filePath: PathLike) => {
    const contestSendData = await createSubmitData(SessionId, id, problemShortName, filePath)
    const resUrl = `https://solve.edu.pl/contests/view/${id}`
    send(SessionId, contestSubmit + id, contestSendData, resUrl)
}

const showProblems = async (SessionId: string, contestId: string, problemId?: string, filePath?: PathLike) => {
    const { problems, own_results }: contestType = await getSolveData(SessionId, pageData, contestId)
    if (problemId) {
        let problemShortName = ''
        let problemName = ''
        if (isNaN(Number(problemId))) {
            ;({ short_name: problemShortName, name: problemName } = problems.find(({ short_name }) => short_name.toLowerCase() === problemId.toLowerCase()))
        } else {
            ;({ short_name: problemShortName, name: problemName } = problems.find(({ id }) => id === problemId))
        }
        if (!problemShortName) {
            printError('No problems found')
            return null
        }
        printValue('Name', problemName)
        printValue('Short name', problemShortName)
        if (!filePath) {
            filePath = await selectFile()
        }
        sendContestSolution(SessionId, problemShortName, contestId, filePath)
    } else {
        const choices = problems.map(({ short_name, name, id, contest_id, problem_id, multiplier }) => {
            return {
                name: `${short_name} - ${handleSubmitStatus(own_results[id].solution_status)} - ${name}`,
                value: {
                    name,
                    id,
                    contest_id,
                    problem_id,
                    short_name,
                    multiplier,
                },
            }
        })
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'problem',
                    message: 'Select problem',
                    choices: choices,
                },
            ])
            .then(async ({ problem }: { problem: ArrayElement<typeof choices>['value'] }) => {
                showProblemInfo(problem)
                await showProblemOptions(SessionId, contestId, problem.short_name, problem.id)
            })
    }
}

const showProblemOptions = async (SessionId: string, contestId: string, problemShortName: string, id: string) => {
    const choices = [sendSolutionOption, descriptionOption, quitOption]
    await inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Select option',
                choices: choices,
            },
        ])
        .then(async ({ option }: { option: string }) => {
            switch (option) {
                case sendSolutionOption: {
                    const filePath = await selectFile()
                    if (filePath) {
                        await sendContestSolution(SessionId, problemShortName, contestId, filePath)
                    }
                    break
                }
                case descriptionOption:
                    await showProblemDescription(id)
                    break
            }
        })
}

const showProblemInfo = ({ name, id, contest_id, problem_id, short_name }: problemObjectType) => {
    printTip('Problem Info')
    printInfo('Name', name)
    printInfo('ID', id)
    printInfo('Contest ID', contest_id)
    printInfo('Problem ID', problem_id)
    printInfo('Short name', short_name)
    printInfo('Description link', `https://solve.edu.pl/contests/download_desc/${id}`)
}

const isCppFile = (value: string, ext = '.cpp') => {
    if (extname(value) === ext || extname(value) === '') {
        return true
    }
}

export const selectFile = async (ext?: string) => {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
    return await inquirer
        .prompt([
            {
                type: 'file-tree-selection',
                name: 'filePath',
                message: 'Select file',
                onlyShowValid: true,
                validate: (val: string) => isCppFile(val, ext),
            },
        ])
        .then(async ({ filePath }: { filePath: PathLike }) => {
            if (!lstatSync(filePath).isDirectory()) {
                return filePath
            } else {
                printError("You can't select a directory")
                printTip('Press <tab> to expand the directory and select a valid file')
                return null
            }
        })
}

export default showProblems
