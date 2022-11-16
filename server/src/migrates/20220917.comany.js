print('migrate company')
db.companies.insert({ "_id" : ObjectId("631dd29f45c9dfa887f59ee2"), 
  "name": "上海创兴建筑设备租赁有限公司",
  "tc": "一般纳税人",
  "tin": "913101047569906221",
  "role": "关联公司",
  "createdAt": ISODate("2022-09-11T12:20:47.789Z"),
  "updatedAt": ISODate("2022-09-11T12:27:44.999Z"), "__v": 0
})
db.companies.insert({ "_id" : ObjectId("631dd2c845c9dfa887f59eeb"), "name" : "上海领隆建筑设备租赁中心", "tc" : "一般纳税人", "tin" : "91310120MA1HUNAB4M", "role" : "关联公司", "createdAt" : ISODate("2022-09-11T12:21:28.407Z"), "updatedAt" : ISODate("2022-09-11T12:27:47.416Z"), "__v" : 0 })
db.companies.insert({ "_id" : ObjectId("631dd2e545c9dfa887f59ef2"), "name" : "上海誉良建筑工程发展有限公司", "tc" : "一般纳税人", "tin" : "913102306660538118", "role" : "关联公司", "createdAt" : ISODate("2022-09-11T12:21:57.229Z"), "updatedAt" : ISODate("2022-09-11T12:27:50.264Z"), "__v" : 0 })
db.companies.insert({ "_id" : ObjectId("631dd32645c9dfa887f59ef7"), "name" : "上海标济建材有限公司", "tc" : "一般纳税人", "tin" : "91310120554323899B", "role" : "关联公司", "createdAt" : ISODate("2022-09-11T12:23:02.327Z"), "updatedAt" : ISODate("2022-09-11T12:27:53.068Z"), "__v" : 0 })
db.companies.insert({ "_id" : ObjectId("631dd35145c9dfa887f59efc"), "name" : "上海中乾源鼎建设集团有限公司", "tc" : "一般纳税人", "tin" : "91310117MA7J3JM480", "role" : "关联公司", "createdAt" : ISODate("2022-09-11T12:23:45.681Z"), "updatedAt" : ISODate("2022-09-11T12:27:55.598Z"), "__v" : 0 })
db.companies.insert({ "_id" : ObjectId("631dd39245c9dfa887f59f03"), "name" : "中建三局集团有限公司", "tc" : "一般纳税人", "tin" : "91420000757013137P", "role" : "客户公司", "createdAt" : ISODate("2022-09-11T12:24:50.083Z"), "updatedAt" : ISODate("2022-09-11T12:24:50.083Z"), "__v" : 0 })
print('migrate company done')