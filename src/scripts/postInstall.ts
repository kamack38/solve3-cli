import Configstore from 'configstore'

try {
    new Configstore('solve3-cli', { username: '', password: '', authCookie: '', favorites: [] })
    console.log('Config file has been created!')
} catch (err) {
    console.error(err)
}
