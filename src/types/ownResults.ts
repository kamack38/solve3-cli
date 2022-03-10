type ownResult = {
    solution_status: string
    solution_result: number
    solution_id: string
}

interface ownResults {
    [key: number]: ownResult
}

export default ownResults
