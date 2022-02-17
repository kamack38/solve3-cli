import chalk from 'chalk';
import figures from 'figures';
import axios from 'axios';
import { JSDOM } from 'jsdom';
const getCSRFToken = async (route, csrf_action, PHPSessionId) => {
    return await axios
        .get(`https://solve.edu.pl/${route}`, PHPSessionId
        ? {
            headers: {
                Cookie: `PHPSESSID=${PHPSessionId};`,
            },
        }
        : {})
        .then((res) => {
        var _a;
        const dom = new JSDOM(res.data);
        const token = (_a = dom.window.document.querySelector(`input[name='csrf_action'][value='${csrf_action}']+input[name='csrf_token']`)) === null || _a === void 0 ? void 0 : _a.getAttribute('value');
        if (!token) {
            console.error(chalk.red(figures.cross), chalk.redBright.bold('CSRF token could not be retrieved!'));
        }
        return token;
    })
        .catch((error) => {
        console.log(chalk.redBright(figures.cross), error);
    });
};
export default getCSRFToken;
//# sourceMappingURL=getCSRFToken.js.map