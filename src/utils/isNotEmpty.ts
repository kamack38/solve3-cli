const isNotEmpty = (obj: object | undefined): boolean => {
    if (typeof obj === 'object') {
        return Object.keys(obj).length !== 0
    }
    return false
}

export default isNotEmpty
