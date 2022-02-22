import chalk from 'chalk'
import figures from 'figures'
import getSolveData from '../utils/getSolveData.js'

const downloadSubmitCode = async (SessionId: string, submitId: string) => {
    const submitCode = await getSolveData(SessionId, 'submitSource', submitId)
    console.log(submitCode)
    if (submitCode) {
        console.log(chalk.green(`${figures.tick} File has been successfully downloaded.`))
        return submitCode
    }
}

export default downloadSubmitCode
