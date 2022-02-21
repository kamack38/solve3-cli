import chalk from 'chalk'
import figures from 'figures'
import axios from 'axios'

const routes = {
    contests: 'contests/get_list?param=',
    pageData: 'contests/get_page/',
    contestData: 'contests/get_contest_data/',
    description: 'contests/download_desc/',
    submitDetails: 'contests/get_report/',
}

const getRoute = (routeName: string, param: string, suffix: string | number) => {
    if (routeName in routes) {
        return routes[routeName] + (param ? param : '') + (suffix ? '/' + suffix : '')
    } else {
        console.error(`Route '${routeName}' doesn't exist on object routes'`)
    }
}

const getSolveData = async (PHPSessionId: string, routeName: string, param?: string, suffix?: string | number) => {
    const route = getRoute(routeName, param, suffix)
    return await axios
        .get(route, {
            baseURL: 'https://solve.edu.pl/',
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        })
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            console.log(chalk.redBright(figures.cross), error)
        })
}

export default getSolveData
