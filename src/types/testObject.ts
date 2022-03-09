type test = {
    name: string
    time: string
    status: string
    mem_limit: string
    mem: string
    max_points: string
    result: string
    points: string
    comment: string
}

type submitObject = {
    id: string
    problem_id: string
    contest_id: string
    author: string
    lang: string
    size: string
    md5: string
    time: string
    example_status: string
    status: string
    test: string
    result: number
    max_result: number
    time_used: string
    mem_used: string
    judge_status: string
    judge_id: string
    compilation_log: string
    short_name: string
    problem_name: string
    first_name: string
    last_name: string
    comment: string
}

type testObject = {
    tests: test[]
    submit: submitObject
}

export default testObject
