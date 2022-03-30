import axios from 'axios'
import { JSDOM } from 'jsdom'
import { printError } from '../utils/messages.js'

const getCSRFToken = async (route: string, csrf_action: string, SessionId?: string) => {
    return await axios
        .get(
            route,
            SessionId
                ? {
                      baseURL: 'https://solve.edu.pl/',
                      headers: {
                          Cookie: `PHPSESSID=${SessionId};`,
                      },
                  }
                : {
                      baseURL: 'https://solve.edu.pl/',
                  },
        )
        .then((res: { data: string }) => {
            const dom = new JSDOM(res.data)
            const token = dom.window.document.querySelector(`input[name='csrf_action'][value='${csrf_action}']+input[name='csrf_token']`)?.getAttribute('value')
            if (!token) {
                printError('CSRF token could not be retrieved!')
                return ''
            }
            return token
        })
        .catch((error: Error) => {
            printError(error.message)
            return null
        })
}
export default getCSRFToken
