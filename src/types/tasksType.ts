type tasksType = {
    total_pages: number
    total_count: string
    records: task[]
}

type task = {
    id: string
    short_name: string
    name: string
    level: string
}

export default tasksType
