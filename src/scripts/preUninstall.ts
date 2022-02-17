import fs from 'fs'
import Configstore from 'configstore'

const config = new Configstore('solve3-cli')
fs.unlink(config.path, (err) => {
    if (err) throw err
    console.log('Config file has been deleted!')
})
