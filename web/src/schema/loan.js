export default [
    {
        name: "id",
        label: "贷款编号",
        type: "text",
        required: true,
    },
    {
        name: "companyId",
        label: "对方单位",
        type: "text",
        option: {
            type: "ref",
            ref: "company",
            value: "_id",
            label: "name"
        },
        required: true,
    },
    {
        name: "date",
        label: "日期",
        type: "date",
        required: true,
    },
    {
        name: "money",
        label: "金额",
        type: "number",
        required: true,
    },
    {
        name: "rate",
        label: "利率",
        type: "number",
        required: true,
    },
    {
        name: "type",
        label: "类型",
        type: "text",
        option: {
            type: "static_value_only",
            values: ["借出", "借入"]
        },
        required: true,
    },
    {
        name: "comments",
        label: "备注",
        type: "text",
        col: 'fullwidth',
    }
]
