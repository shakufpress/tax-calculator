import React, { useCallback, useState } from 'react';
import { BudgetEntry } from '../budgetData'
import { TreeNode } from './formulas'

const shekel = (n: number) => `${Number(Math.floor(n)).toLocaleString()} ₪`;

export interface TaxData {
    annualIncome: number;
    netIncome:number;
    annualPartnerIncome: number;
    taxWithoutReductions: number;
    bonusPoints: number;
    taxReduction: number;
    incomeTax: number;
    partnerTax: number;
    netAnnualPartnerIncome: number;
    householdIncome: number;
    netMonthlyHouseholdIncome: number;
    decile: number | undefined;
    monthlyVat: number;
    householdAnnualVat: number;
    totalAnnualTax: number;
    myAnnualVat: number;
    personalBudgetFactor: number;
}

function moneyFor(entry: BudgetEntry, tax: TaxData, budget: BudgetEntry): string {
    if (!budget || !budget.net_revised)
        return ''
    return shekel(Math.round(entry.net_revised * tax.totalAnnualTax / budget.net_revised))
}

function ValueAndPurpose({entry, tax, budget}: {entry: BudgetEntry, tax: TaxData, budget: BudgetEntry}) {
    return <React.Fragment><span className="value">{moneyFor(entry, tax, budget)}</span><span className="purpose">עבור&nbsp;{entry.title}</span></React.Fragment>
}

function getChildren(e: BudgetEntry) : BudgetEntry[] {
    if (!e.children || !e.children.length)
        return []

    if (e.children.length === 1)
        if (e.children[0] && e.children[0].children.length > 1)
            return e.children[0].children
    return e.children
}

const SubEntry = ({entry, tax, budget}: {entry: BudgetEntry, tax: TaxData, budget: BudgetEntry}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return <React.Fragment> 
        <tr className="sub-entry" key={entry.code} onClick={() => setIsOpen(!isOpen)} data-open={isOpen ? 'yes' : 'no'}>
            <td className="value">{moneyFor(entry, tax, budget)}</td>
            <td className="purpose">עבור&nbsp;{entry.title}
            </td>
        </tr>
             <tr className="sub-entry-details"><td colSpan={2}>
                {getChildren(entry).map(child => 
                <li key={child.code}>
                    <ValueAndPurpose budget={budget} tax={tax} entry={child} />
                 </li>)}
             </td></tr>
            </React.Fragment>
}

const TopLevelEntry = ({entry, tax, budget}: {entry: BudgetEntry, tax: TaxData, budget: BudgetEntry}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return <div data-open={isOpen ? 'yes' : 'no '} className="top-level-entry" id={`entry-${entry.code}`} key={'e-' + entry.code}>
        <div className="entry-heading" onClick={() => setIsOpen(!isOpen)}>
        <svg className="arrow" viewBox="0 0 24 24" preserveAspectRatio="none">
            <path d="M 24 0 L 0 12 L 24 24" />
        </svg>
        <ValueAndPurpose entry={entry} budget={budget} tax={tax} />
        </div>
        <table className="details">
            <tbody>
            {getChildren(entry).map(child => <SubEntry entry={child} tax={tax} budget={budget} key={child.code} />)}
            </tbody>
        </table>
    </div>
}
const Results = ({sex, tax, budget}: {sex: 'm' | 'f', tax: TaxData, budget: BudgetEntry}) => {
    const toTreeNode = useCallback((e: BudgetEntry) : TreeNode => ({
            name: `${e.title}: ${shekel(e.net_revised * tax.personalBudgetFactor)} בשנה`,
            code: e.code,
            title: e.title,
            value: Math.round(e.net_revised * tax.totalAnnualTax / budget.net_revised),
            toggled: true,
            children: (e.children || []).map(toTreeNode)
        }), [tax, budget])

    const male = (sex === 'm')
    return <div className="results">
        <div className="hero">
            <div className="content">
            <span>{male ? 'סכום המיסים שאתה משלם בשנה' : 'סכום המיסים שאת משלמת בשנה'}: {}
            &nbsp;</span>
            <span className="income">כ-{shekel(tax.totalAnnualTax)}</span>
            </div>
        </div>
        {budget ? <div className="budget strip">
            <div className="content">
            <span className="desktop-only">לאן זה הולך?</span>
            <div className="budget-tree">
            {
                getChildren(budget).map(e => <TopLevelEntry entry={e} tax={tax} budget={budget} key={e.code} />)
            }
            </div>
            </div>
        </div> : <div className="loading-budget">עוד רגע...</div>}
    </div>

}

export default Results;