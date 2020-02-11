export type RawBudgetEntry = {
    code: string
    parent: string | null
    title: string
    total_direction_expense: number
}

export type BudgetEntry = RawBudgetEntry & {
    code: string
    parentEntry: BudgetEntry | null
    children: BudgetEntry[]
}

export type Budget = {
    budget: {[code: string]: BudgetEntry}
    roots: BudgetEntry[]
    total: number
}

const maxDepth = 3
function getYear() {
    return Math.min(new Date().getFullYear(), 2019)
}
const getQuery = (offset: number) =>
    `https://next.obudget.org/api/query?query=${
        encodeURIComponent(`select code,parent,title,total_direction_expense from budget where year=${
            getYear()} and depth < ${maxDepth} and total_direction_expense > 0 offset ${offset}`)}`

export function fixBudget(rawBudget: RawBudgetEntry[]): Budget {
    //const budget = rawBudget.sort((a, b) => b.total_direction_expense - a.total_direction_expense).map(b => ({[b.code]: {...b}})).reduce((a, o) => Object.assign(a, o), {})  as any as {[code: string]: BudgetEntry}
    const budget = rawBudget.map(b => ({[b.code]: {...b}})).reduce((a, o) => Object.assign(a, o), {})  as any as {[code: string]: BudgetEntry}
    const budgetValues = Object.values(budget)
    for (const code in budget) {
        const e = budget[code]
        e.parentEntry = e.parent ? budget[e.parent] : null
        e.children = budgetValues.filter(({parent}) => parent === code)
        e.children.sort((a, b) => b.total_direction_expense - a.total_direction_expense)
    }

    let roots = budgetValues.filter(({parent}) => !parent)
    while (roots.length === 1) {
        roots = roots[0].children
    }
    roots.sort((a, b) => b.total_direction_expense - a.total_direction_expense)
    return {roots, budget, total: budget['00'] ? budget['00'].total_direction_expense : 0}
}
export async function downloadBudget() : Promise<RawBudgetEntry[]> {
    let offset = 0
    let rawBudget : RawBudgetEntry[] = []
    let total = 0

    while (!rawBudget.length || rawBudget.length !== total) {
        const resp = await fetch(getQuery(offset));
        const raw = await resp.json();
        rawBudget = [...rawBudget, ...raw.rows]
        if (!raw.rows.length) {
            break;
        }
        offset += raw.rows.length
    }

    return rawBudget
}