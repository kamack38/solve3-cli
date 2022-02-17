import fs from 'fs'
import Configstore from 'configstore'

const packageJson = await JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const config = new Configstore(packageJson.name)
fs.unlink(config.path, (err) => {
    if (err) throw err
    console.log('Config file has been deleted!')
})
