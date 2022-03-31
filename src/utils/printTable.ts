import chalk from 'chalk'
import { table } from 'table'
import { printError } from '../utils/messages.js'

export const handleSubmitStatus = (status: string) => {
    let pref = ''
    if (status.split('Przykład: ').length > 1) {
        status = status.split('Przykład: ')[1]
        pref = 'E: '
    }
    switch (status) {
        case '<span class="badge badge-success">OK</span>':
            return chalk.bgGreen.whiteBright(` ${pref}OK `)
        case '<span class="badge badge-important">Błędna odpowiedź</span>':
            return chalk.bgRed.whiteBright(` ${pref}WA `)
        case '<span class="badge badge-warning">Limit czasu przekroczony</span>':
            return chalk.bgHex('#ff7518').whiteBright(` ${pref}TLE `)
        case '<span class="badge badge-inverse">Naruszenie bezpieczeństwa</span>':
            return chalk.bgBlack.whiteBright(` ${pref}RV `)
        case '<span class="badge badge-inverse">Błąd kompilacji</span>':
            return chalk.bgBlackBright.whiteBright(` ${pref}CE `)
        case '<span class="badge badge-info">Błąd wykonania</span>':
            return chalk.bgHex('#9954bb').whiteBright(` ${pref}RE `)
        case '<span class="badge">?</span>':
            return chalk.bgYellow.blackBright(` ${pref}? `)
        case '':
            return ''
    }
    printError('Error no contest badge found with status: ' + status)
    return ''
}

const printTable = (title: string, descriptionColumns: string[], data: { [key: string]: string | number | Date }[], dataTemplate: string[], titleSuffix?: string) => {
    if (descriptionColumns.length != dataTemplate.length) {
        printError('Length of description columns and data template must match!')
        return null
    }

    const size = titleSuffix ? descriptionColumns.length - 2 : descriptionColumns.length - 1
    const tableTitle = [title]
    tableTitle.push(...new Array(size).fill(''))
    titleSuffix ? tableTitle.push(titleSuffix) : null

    const tableData = data.map((values) => {
        const row: string[] = []
        dataTemplate.forEach((el) => {
            el = String(el)
            const val = String(values[el])
            switch (el) {
                case 'status':
                    row.push(handleSubmitStatus(val))
                    break
                case 'time':
                    row.push(val.replace(/<.*?>/g, '').trim())
                    break
                case 'mem':
                    row.push(val ? `${val.replace(/\s/g, '')}/${values['mem_limit']}MB` : '')
                    break
                case 'comment':
                    row.push(val.replace(/ +/g, ' ').replace('Å‚', 'ł').trim())
                    break
                default:
                    row.push(val)
            }
        })
        return row
    })
    tableData.unshift(tableTitle, descriptionColumns)
    const tableConfig = {
        spanningCells: [{ col: 0, row: 0, colSpan: size + 1 }],
    }
    console.log(table(tableData, tableConfig))
}

export default printTable
