import chalk from 'chalk'
import chroma from 'chroma-js'
import { table } from 'table'
import getSolveData from '../utils/getSolveData.js'
import { pageData } from '../lib/routes.js'
import rankingObject from '../types/rankingObject.js'
import contestData from '../types/contestData.js'
import { printError } from '../utils/messages.js'

const setResultColor = (result: number, maxValue: number = 100) => {
    const f = chroma.scale(['red', 'yellow', 'orange', 'LimeGreen'])
    return chalk.hex(f(result / maxValue).toString())(result)
}

const showRanking = async (SessionId: string, id: string, afterTime: boolean = false) => {
    const res: contestData = await getSolveData(SessionId, pageData, id + '/' + 1 + '/', {
        want_after: afterTime,
    })

    if (!res || !res.ranking.length) {
        printError('Ranking is NOT available!')
        return
    }
    const { ranking, contest } = res
    const contestName = contest.name

    const tableData = ranking.map(({ name, rank_result, rank_details }: rankingObject) => {
        const results = []
        for (const key in rank_details) {
            const problemData = rank_details[key]
            results.push(setResultColor(problemData.rank_result))
        }
        return [chalk.cyan(name), ...results, setResultColor(rank_result, results.length * 100)]
    })

    const descriptionColumns = ['Name']
    for (const key in ranking[0].rank_details) {
        const shortName = ranking[0].rank_details[key].short_name
        descriptionColumns.push(shortName)
    }
    descriptionColumns.push('Result')
    tableData.unshift(descriptionColumns)

    const emptyColumns = tableData[0].length
    const tableTitle = [`Ranking: ${chalk.cyanBright(contestName)}`]
    tableTitle.length = emptyColumns
    tableTitle.fill('', 1, emptyColumns)
    tableData.unshift(tableTitle)

    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: emptyColumns }],
    }
    console.log(table(tableData, tableConfig))
}

export default showRanking
