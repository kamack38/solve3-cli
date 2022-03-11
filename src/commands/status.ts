import getSolveData from '../utils/getSolveData.js'
import printTable from '../utils/printTable.js'
import { statuses } from '../lib/routes.js'
import { nextPageOption, previousPageOption, quitOption } from '../lib/options.js'
import inquirer from 'inquirer'

type status = {
    id: string
    time: string
    author: string
    test: string
    status: string
    task: string
    time_used: string
    mem_used: string
    result: string
}

type response = {
    records: status[]
    total_pages: number
    total_count: string
}

const showStatus = async (SessionId: string, query: string = '', page: number = 1, myOnly?: boolean) => {
    const { records, total_pages }: response = await getSolveData(SessionId, statuses, '', { page, query, param: myOnly ? true : false })
    const title = query.length ? `🔍 Search: ${query}` : 'Recent submissions'
    const descriptionColumns = ['ID', 'Author', 'Test', 'Task', 'Status', 'Time', 'Memory', 'Result', 'Date']
    const dataTemplate = ['id', 'author', 'test', 'task', 'status', 'time_used', 'mem_used', 'result', 'time']
    printTable(title, descriptionColumns, records, dataTemplate, `Page: ${page}/${total_pages}`)
    selectPage(SessionId, query, page, total_pages, myOnly)
}

const selectPage = (SessionId: string, query: string = '', page: number, totalPages: number, myOnly: boolean = false) => {
    const choices = [quitOption]
    if (page > 1) choices.push(previousPageOption)
    if (page < totalPages) choices.push(nextPageOption)
    inquirer
        .prompt([
            {
                type: 'list',
                message: `Select option`,
                name: 'option',
                choices: choices,
                loop: true,
            },
        ])
        .then(({ option }) => {
            switch (option) {
                case nextPageOption:
                    showStatus(SessionId, query, page + 1, myOnly)
                    break
                case previousPageOption:
                    showStatus(SessionId, query, page - 1, myOnly)
                    break
            }
        })
}

export default showStatus
