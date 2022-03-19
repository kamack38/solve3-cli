import axios from 'axios'
import { createReadStream } from 'fs'
import FormData from 'form-data'
import getCSRFToken from '../utils/getCSRFToken.js'
import { printError } from '../utils/messages.js'
import { taskSubmit, contestPage } from '../lib/routes.js'

const postSolveData = async (SessionId: string, route: string, data: FormData) => {
    return await axios
        .post(
            route,
            data,
            SessionId
                ? {
                      baseURL: 'https://solve.edu.pl/',
                      headers: {
                          ...data.getHeaders(),
                          Cookie: `PHPSESSID=${SessionId};`,
                      },
                  }
                : {
                      baseURL: 'https://solve.edu.pl/',
                  },
        )
        .then((res) => res)
        .catch((error) => {
            printError(error)
            return error
        })
}

export const createTaskSubmitData = async (SessionId: string, id: string, filePath: string, lang: string = 'cpp') => {
    const formData = new FormData()
    const csrfAction = 'tasks_submit'
    const fileLabel = 'tasks_submit[solution_file]'
    const csrfToken = await getCSRFToken(taskSubmit + id, csrfAction, SessionId)
    formData.append('csrf_action', csrfAction)
    formData.append('csrf_token', csrfToken)
    formData.append('tasks_submit[solution_lang]', lang)
    formData.append(fileLabel, createReadStream(filePath, 'utf8'))
    formData.append('submit_tasks_submit', 'Wyślij')
    return formData
}

export const createSubmitData = async (SessionId: string, id: string, problemShortName: string, filePath: string) => {
    const formData = new FormData()
    const csrfAction = 'contest_submit'
    const csrfToken = await getCSRFToken(contestPage + id, csrfAction, SessionId)
    formData.append('csrf_action', csrfAction)
    formData.append('csrf_token', csrfToken)
    formData.append('contest_submit[problem]', problemShortName)
    formData.append('contest_submit[solution_file]', createReadStream(filePath, 'utf8'))
    return formData
}

export default postSolveData
