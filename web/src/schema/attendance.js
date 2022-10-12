export default [
    {
        name: "employeeID",
        label: "工号",
        type: "text",
        option: {
          type: 'ref',
          ref: 'employee',
          label: 'name',
          value: 'employeeID',
        },
        required: true,
    },
    {
        name: 'projectId',
        label: '项目部',
        type: 'text',
        option: {
          type: 'ref',
          ref: 'project',
          label: 'name',
          value: '_id',
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
        name: "comments",
        label: "备注",
        type: "text",
        col: 'fullwidth',
        rows: 3,
    },
    {
        name: "morning",
        label: "上午",
        type: "number"
    },
    {
        name: "afternoon",
        label: "下午",
        type: "number"
    },
    {
        name: "evening",
        label: "晚上",
        type: "number"
    },
    {
        name: "quantity",
        label: "包量",
        type: "list",
        schema: [
            {
                name: "type",
                label: "类别",
                type: "text",
                option: {
                    type: 'static_value_only',
                    values: ['搭', '拆']
                },
            },
            {
                name: "content",
                label: "工作内容",
                type: "text",
            },
            {
                name: "count",
                label: "数量",
                type: "number"
            },
            {
                name: "price",
                label: "单价",
                type: "number"
            }
        ]
    },
]
