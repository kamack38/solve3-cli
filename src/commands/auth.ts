import axios from 'axios'
import inquirer from 'inquirer'
import FormData from 'form-data'
import getCSRFToken from '../utils/getCSRFToken.js'
import { printSuccess, printError } from '../utils/messages.js'
import { loginRoute } from '../lib/routes.js'

const login = async (username: string, password: string) => {
    const formData = new FormData()
    formData.append('csrf_action', 'user_login')
    formData.append('csrf_token', await getCSRFToken(loginRoute, 'user_login'))
    formData.append('user_login[login]', username)
    formData.append('user_login[password]', password)
    formData.append('submit_user_login', 'Zaloguj')
    return axios
        .post('https://solve.edu.pl/users/login', formData, { headers: formData.getHeaders() })
        .then((res) => {
            const cookie = res.headers['set-cookie'][0].replace(/\;.*/, '').replace(/.*\=/, '')
            printSuccess('Successfully logged in')
            return cookie
        })
        .catch((error) => {
            printError(error)
        })
}

const requireLetterOrNumber = (value: string) => {
    if (/\w/.test(value) || /\d/.test(value)) {
        return true
    }
}

const authenticate = async (username?: string, password?: string) => {
    if (username && password) {
        return await login(username, password)
    } else {
        return await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'user_name',
                    message: 'Enter your username',
                    validate: requireLetterOrNumber,
                },
                {
                    type: 'password',
                    message: 'Enter your password',
                    name: 'pass_word',
                    mask: '*',
                    validate: requireLetterOrNumber,
                },
            ])
            .then(async ({ user_name, pass_word }) => await login(user_name, pass_word))
    }
}

export default authenticate
