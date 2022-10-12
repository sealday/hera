export default [
    {
        label: "工号",
        name: "employeeID",
        type: "text",
        disabled: true,
    },
    {
        "label": "姓名",
        "name": "name",
        "type": "text"
    },
    {
        label: '职务',
        name: 'post',
        type: 'text',
        option: {
            type: 'static_value_only',
            values: 'system.config.posts',
        }
    },
    {
        "label": "性别",
        "name": "gendor",
        "type": "text",
        option: {
            type: 'static_value_only',
            values: ['男', '女']
        }
    },
    {
        "label": "身份证",
        "name": "id",
        "type": "text"
    },
    {
        "label": "电话号码",
        "name": "phone",
        "type": "text"
    },
    {
        "label": "电子邮箱",
        "name": "mail",
        "type": "text"
    },
    {
        "label": "备注",
        "name": "comments",
        "type": "text"
    }
]
