type question = {
    id: string
    contest: string
    title: string
    content: string
    display_time: string
    author: string
    public: string
    answered: string
    first_name: string
    last_name: string
}

interface questions {
    [key: number]: question
}

export default questions
