import getSolveData from '../utils/getSolveData.js'
import { printSuccess } from '../utils/messages.js'
import { submitSource } from '../lib/routes.js'

const downloadSubmitCode = async (SessionId: string, submitId: string) => {
    const submitCode = await getSolveData(SessionId, submitSource, submitId)
    console.log(submitCode)
    if (submitCode) {
        printSuccess('File has been successfully downloaded.')
        return submitCode
    }
}

export default downloadSubmitCode
