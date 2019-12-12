import React, { useMemo, useCallback } from 'react';
import { Tabs } from 'antd';
import calcTax, { TaxInput, TreeNode } from './formulas'
import { BudgetEntry, Budget } from './budgetData';
import TaxPieChart from './TaxPieChart';
import TaxBarChart from './TaxBarChartView';
const {Treebeard} = require('react-treebeard')
const { TabPane } = Tabs;


const callback = (key: any) => {
    console.log(key);
}

const Output = ({label, value}: {label: string, value: string | number}) =>
    <div key={label} className="form-group row">
        <label  className="col-sm-4 col-form-label">{label}</label>
        <output className="col-sm-4">{value}</output>
    </div>

const shekel = (n: number) => `${Number(Math.floor(n)).toLocaleString()} ₪`;
const percent = (n: number) => `${Number(n * 100).toFixed(8)}%`;

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

export interface IncomeData {
    hasPartner: boolean;
    sex: 'm' | 'f';
    numChildren: number;
    partnerIncome: number;
    income: number;
    budget: Budget;
}

const Results = (incomeData: TaxInput) => {
    const tax: TaxData = useMemo(() => calcTax(incomeData), [
        incomeData.hasPartner, incomeData.sex, incomeData.numChildren, incomeData.partnerIncome, incomeData.income, incomeData.budget
    ])

const toTreeNode = useCallback((e: BudgetEntry) : TreeNode => ({
        name: `${e.title} : ${shekel(e.total_direction_expense * tax.personalBudgetFactor)}`,
        code: e.code,
        title: e.title,
        value: Math.round(e.total_direction_expense * tax.personalBudgetFactor),
        toggled: true,
        children: (e.children || []).map(toTreeNode)
    }), [tax.personalBudgetFactor])

const treeBeardData = useMemo(() => ({
        name: 'תקציב המדינה',
        code: '0',
        title: 'תקציב המדינה',
        value: incomeData.income,
        toggled: true,
        children: incomeData.budget.roots.map(e => toTreeNode(e))
    }), [incomeData.budget, toTreeNode])

    treeBeardData.children = treeBeardData.children.filter(d => d.code !== "00");

    return (<div>
        <Tabs defaultActiveKey="4" onChange={callback} tabPosition="right">
            <TabPane tab="נתוני הכנסה" key="1">
            <h3>עיבוד נתונים</h3>
                <Output label="הכנסה שנתית" value={shekel(tax.annualIncome)} />
                <Output label="הכנסה נטו שלי (שנתי)" value={shekel(tax.netIncome)} />
                <Output label="הכנסה שנתית של בן/בת הזוג" value={shekel(tax.annualPartnerIncome)} />
                <Output label="מס הכנסה ללא נקודות זיכוי" value={shekel(tax.taxWithoutReductions)} />
                <Output label="מספר נקודות זיכוי" value={tax.bonusPoints} />
                <Output label="הפחת מס בזכות נקודות זיכוי" value={shekel(tax.taxReduction)} />
                <Output label="סה״כ מס הכנסה שנתי" value={shekel(tax.incomeTax)} />
                <Output label="מס שבן הזוג משלם" value={shekel(tax.partnerTax)} />
                <Output label="הכנסה נטו של בן הזוג (שנתי)" value={shekel(tax.netAnnualPartnerIncome)} />
                <Output label="הכנסה נטו למשק הבית" value={shekel(tax.householdIncome)} />
                <Output label="חישוב הכנסה נטו חודשית" value={shekel(tax.netMonthlyHouseholdIncome)} />
                <Output label="עשירון משק הבית" value={tax.decile || 0} />
                <Output label="כמה מע״מ משק הבית משלם בחודש?" value={shekel(tax.monthlyVat)} />
                <Output label="כמה מע״מ משק הבית משלם בשנה?" value={shekel(tax.householdAnnualVat)} />
                <Output label="כמה מע״מ אני משלם בשנה?" value={shekel(tax.myAnnualVat)} />
                <Output label="כמה מס אני משלם בשנה?" value={shekel(tax.totalAnnualTax)} />
            </TabPane>
            <TabPane tab="התפלגות מס" key="2">
                {incomeData.budget.total ? <div className="withBudget">
                    <Output label="פקטור" value={percent(tax.personalBudgetFactor)} />
                    <div className="budget">
                        <Treebeard data={treeBeardData} />
                    </div>
                </div> : <span>Loading...</span>}
            </TabPane>
            <TabPane tab="תרשים התפלגות" key="3">
                <TaxPieChart data={treeBeardData}/>
            </TabPane>
            <TabPane tab="תרשים עמודות" key="4">
                <TaxBarChart data={treeBeardData}/>
            </TabPane>
  </Tabs>,
    </div>);
}

export default Results;