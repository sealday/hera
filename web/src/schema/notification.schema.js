const NotificationSchema = [
    {
        "label": "通知标题",
        "name": "title",
        "type": "text"
    },
    {
        "label": "通知内容",
        "name": "content",
        "type": "text"
    },
    {
        "label": "已读",
        "name": "read",
        "type": "boolean"
    },
    {
        "label": "通知时间",
        "name": "createdAt",
        "type": "datetime",
        "format": "calendar",
    }
    // {
    //     "label": "标签",
    //     "name": "tags",
    //     "type": "text"
    // },
]

export default NotificationSchema