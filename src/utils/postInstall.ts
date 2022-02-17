import fs from 'fs'
import Configstore from 'configstore'
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

new Configstore(packageJson.name, { username: '', password: '', authCookie: '', favorites: [] })
