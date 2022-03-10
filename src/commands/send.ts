import inquirer from 'inquirer'
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'
import { lstatSync } from 'node:fs'
import { extname } from 'node:path'
import showProblemDescription from './description.js'
import getSolveData from '../utils/getSolveData.js'
import postSolveData, { createSubmitData } from '../utils/postSolveData.js'
import { printInfo, printError, printSuccess, printTip } from '../utils/messages.js'
import { contestSubmit, pageData } from '../lib/routes.js'
import { sendSolutionOption, descriptionOption, quitOption } from '../lib/options.js'
import problemObjectType from '../types/problemObject.js'
import contestData from '../types/contestData.js'
import { handleSubmitStatus } from '../utils/printTable.js'

const send = async (SessionId: string, problemShortName: string, id: string, filePath: string) => {
    const contestSendData = await createSubmitData(SessionId, id, problemShortName, filePath)
    postSolveData(SessionId, contestSubmit + id, contestSendData)
        .then((res) => {
            const responseUrl = res.request.res.responseUrl
            if (responseUrl === `https://solve.edu.pl/contests/view/${id}`) {
                printSuccess('File has been successfully sent!')
            } else {
                printError('Error while sending the file')
            }
        })
        .catch((error) => {
            printError(error)
        })
}

const showProblems = async (SessionId: string, contestId: string, problemId?: string, filePath?: string) => {
    const { problems, own_results }: contestData = await getSolveData(SessionId, pageData, contestId)
    const choices = problems.map(({ short_name, name, id }) => `${short_name} - ${handleSubmitStatus(own_results[id].solution_status)} - ${name}`)
    if (problemId) {
        const problemShortName = problems.find(({ id }) => id === problemId).short_name
        printTip(`Short name : ${problemShortName}`)
        if (filePath) {
            send(SessionId, problemShortName, contestId, filePath)
        } else {
            const filePath = await selectFile()
            if (filePath) {
                send(SessionId, problemShortName, contestId, filePath)
            }
        }
    } else {
        await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'problem',
                    message: 'Select problem',
                    choices: choices,
                },
            ])
            .then(async ({ problem }) => {
                const problemObject = problems.find(({ short_name }) => short_name === problem.split(' ')[0])
                showProblemInfo(problemObject)
                await showProblemOptions(SessionId, contestId, problemObject.short_name, problemObject.id)
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
        .then(async ({ option }) => {
            switch (option) {
                case sendSolutionOption:
                    const filePath = await selectFile()
                    if (filePath) {
                        send(SessionId, problemShortName, contestId, filePath)
                    }
                    break
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

const isCppFile = (value: string, ext: string = '.cpp') => {
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
        .then(async ({ filePath }) => {
            if (!lstatSync(filePath).isDirectory()) {
                return filePath
            } else {
                printError("You can't select a directory")
                printTip('Press <tab> to expand the directory and select a valid file')
            }
        })
}

export default showProblems
