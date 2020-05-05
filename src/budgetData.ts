export type RawBudgetEntry = {
    code: string
    parent: string | null
    title: string
    net_revised: number
}

export type BudgetEntry = RawBudgetEntry & {
    code: string
    parentEntry: BudgetEntry | null
    children: BudgetEntry[]
}

const maxDepth = 8;
function getYear() {
    return Math.min(new Date().getFullYear(), 2019)
}
const getQuery = (offset: number) =>
    `https://next.obudget.org/api/query?query=${
        encodeURIComponent(`select code,parent,title,net_revised from budget where year=${
            getYear()} and depth < ${maxDepth} and net_revised > 0 order by code ${offset ? `offset ${offset}`: ''}`)}`

export function fixBudget(rawBudget: RawBudgetEntry[]): BudgetEntry {
    const budget = rawBudget.map(b => ({[b.code]: {...b}})).reduce((a, o) => Object.assign(a, o), {})  as any as {[code: string]: BudgetEntry}
    const budgetValues = Object.values(budget)
    for (const code in budget) {
        const e = budget[code]
        e.parentEntry = e.parent ? budget[e.parent] : null
        e.children = budgetValues.filter(({parent}) => parent === code)
        e.children.sort((a, b) => b.net_revised - a.net_revised)
    }

    return budgetValues.find(b => b.code === '00') as BudgetEntry
}
export async function downloadBudget() : Promise<RawBudgetEntry[]> {
    const resp = await (await fetch(getQuery(0))).json()
    const {rows, total} = resp as {rows: RawBudgetEntry[], total: number}
    if (rows.length === total)
        return rows

    let budget = rows

    const offsets = Array(Math.ceil(total / rows.length) - 1).fill(0).map((a, i) => (i + 1) * rows.length)

    await Promise.all(offsets.map(async offset => {
        const {rows} = await (await fetch(getQuery(offset))).json()
        budget = [...budget, ...rows]
    }))

    return budget
}