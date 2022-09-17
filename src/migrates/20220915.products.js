print('migrate products start')
const products = [
  , { type: '费用类', number: 10001, name: '维修人工', size: '改制费' }
  , { type: '费用类', number: 10002, name: '维修人工', size: '调直费' }
  , { type: '费用类', number: 10003, name: '维修人工', size: '上油费' }
  , { type: '费用类', number: 10004, name: '维修人工', size: '清理费' }
  , { type: '费用类', number: 10101, name: '有物赔偿类', size: '有物赔偿' }
  , { type: '费用类', number: 10102, name: '有物赔偿类', size: '扣件螺丝' }
  , { type: '费用类', number: 10103, name: '有物赔偿类', size: '缺盖板' }
  , { type: '费用类', number: 10104, name: '有物赔偿类', size: '缺接头芯' }
  , { type: '费用类', number: 10105, name: '有物赔偿类', size: '螺丝螺帽' }
  , { type: '费用类', number: 10106, name: '有物赔偿类', size: '螺丝螺杆' }
  , { type: '费用类', number: 10107, name: '有物赔偿类', size: '套筒57头' }
  , { type: '费用类', number: 10108, name: '有物赔偿类', size: '轮扣57头' }
  , { type: '费用类', number: 10109, name: '有物赔偿类', size: '轮扣圆盘' }
  , { type: '费用类', number: 10110, name: '有物赔偿类', size: '轮扣横杆头' }
  , { type: '费用类', number: 10111, name: '有物赔偿类', size: '缺螺帽' }
  , { type: '费用类', number: 10112, name: '有物赔偿类', size: '缺底座' }
  , { type: '费用类', number: 10113, name: '有物赔偿类', size: '盘扣圆盘' }
  , { type: '费用类', number: 10114, name: '有物赔偿类', size: '盘扣57头' }
  , { type: '费用类', number: 10115, name: '有物赔偿类', size: '盘扣插销' }
  , { type: '费用类', number: 10116, name: '有物赔偿类', size: '盘扣横杆头' }
  , { type: '费用类', number: 10201, name: '无物赔偿类', size: '无物赔偿' }
  , { type: '费用类', number: 10301, name: '装卸运费', size: '整理费' }
  , { type: '费用类', number: 10302, name: '装卸运费', size: '运费' }
  , { type: '费用类', number: 10303, name: '装卸运费', size: '上车费' }
  , { type: '费用类', number: 10304, name: '装卸运费', size: '下车费' }
]
db.products.insertMany(products)
print('migrate products done.')