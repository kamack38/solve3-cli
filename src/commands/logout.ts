import getSolveData from '../utils/getSolveData.js'
import { printSuccess, printError } from '../utils/messages.js'
import { loginRoute } from '../lib/routes.js'
import { JSDOM } from 'jsdom'

const logout = async (SessionId: string) => {
    try {
        const res: string = await getSolveData(SessionId, loginRoute)
        const dom = new JSDOM(res)
        const url = dom.window.document.querySelector('a[href^="https://solve.edu.pl/CSRF_TOKEN="]')?.getAttribute('href')
        getSolveData(SessionId, url)
        printSuccess('You have been successfully logged out')
        return true
    } catch (e) {
        printError(e)
    }
}

export default logout
