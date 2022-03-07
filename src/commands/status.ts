import getSolveData from '../utils/getSolveData.js'
import printTable from '../utils/printTable.js'
import { statuses } from '../lib/routes.js'

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

const showStatus = async (SessionId: string, query: string = '', page: string | number = 1, myOnly?: boolean) => {
    const { records, total_pages }: response = await getSolveData(SessionId, statuses, '', { page, query, param: myOnly ? true : false })
    const title = query.length ? `🔍 Search: ${query}` : 'Recent submits'
    const descriptionColumns = ['ID', 'Author', 'Test', 'Task', 'Status', 'Time', 'Memory', 'Result', 'Date']
    const dataTemplate = ['id', 'author', 'test', 'task', 'status', 'time_used', 'mem_used', 'result', 'time']
    printTable(title, descriptionColumns, records, dataTemplate, `Page: ${page}/${total_pages}`)
}

export default showStatus
