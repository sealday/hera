const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const service = require('../service')
const Counter = require('../models').Counter

/**
 * 仓库记录
 * TODO 建立合适的索引加速查询
 */
const recordSchema = {
  outStock: Schema.Types.ObjectId, // 出库仓库
  inStock: Schema.Types.ObjectId, // 入库仓库

  username: String, // 填单子的人
  vendor: String, // 对方单位，采购单和销售单专用
  comments: String, // 备注
  status: String, // 状态 采购单用来说明是否付款过
  order: Schema.Types.ObjectId, // 单号
  originalOrder: String, // 原始单号

  entries: [{
    type: { // 类型
      type: String
    },
    number: Number, // 编号
    name: String, // 名称
    size: String, // 规格
    count: Number, // 数量
    total: Number, // 小计
    unit: String, // 单位
    price: Number, // 单价
    sum: Number, // 金额
    freightCount: Number, // 多少 吨/趟
    freightUnit: String, // 运费单位
    freightPrice: Number, // 运费单价
    freight: Number, // 运费
    mixPrice: Number, // 综合单价
    mixSum: Number, // 综合金额
    comments: String, // 备注
    /**
     *
     * L lease 租赁，库存同方向，计算和时间有关
     * C compensation  赔偿，库存反方向，计算和时间无关
     * S sales 销售，库存同方向， 计算和时间无关
     * R repair 维修，不涉及库存，计算和时间无关
     */
    mode: {
      type: String,
      enum: ['L', 'C', 'S', 'R'],
      default: 'L'
    }, // 模式，
  }], // 订单项

  outDate: Date, // 出库时间
  //FIXME
  inDate: Date, // 入库时间  暂时用不到

  carNumber: String, // 车号

  fee: {
    car: Number, // 车费
    sort: Number, // 整理
    other1: Number, // 其他1
    other2: Number, // 其他2
  },

  hasTransport: { type: Boolean, default: false }, // 是否有对应运输单
  transportPaid: { type: Boolean, default: false }, // 是否付过款
  transportChecked: { type: Boolean, default: false }, // 是否核对过
  transport: { 'off-date': Date,
    'arrival-date': Date, // 到达日期
    weight: String, // 重量
    price: String, // 价格
    payer: String, // 付款方
    payDate: Date, // 付款日期
    'pay-info': String, // 付款信息
    payee: String, // 收款人
    bank: String, // 收款人开户行
    account: String, // 收款人账号
    'delivery-party': String, // 发货单位
    'delivery-contact': String, // 发货人
    'delivery-phone': String, // 发货人电话
    'delivery-address': String, // 发货地址
    'receiving-party': String, // 收货单位
    'receiving-contact': String, // 收货联系
    'receiving-phone': String, // 收货人电话
    'receiving-address': String, // 收货地址
    'carrier-party': String, // 运输公司
    'carrier-name': String, // 司机名称
    'carrier-phone': String, // 司机电话
    'carrier-id': String, // 司机身份证号码
    'carrier-car': String , // 车牌号
  },

  number: Number, // 订单编号

  valid: { type: Boolean, default: true }, // 是否有效，用来删除时标记为无效
  type: String,  // 采购、调拨、销售、报废、结转、盘点入库、盘点出库
}

const RecordSchema = new Schema(recordSchema, { timestamps: true }); // 时间戳反映真正的制单时间（以录入系统为准）
const HistoryRecordSchema = new Schema(recordSchema, { timestamps: true }); // 时间戳反映真正的制单时间（以录入系统为准）

RecordSchema.pre('save', function (next) {

  // 使缓存无效
  service.invalidStockCache(this.inStock)
  service.invalidStockCache(this.outStock)

  if (!this.number) {
    // 初始化单号
    Counter.findByIdAndUpdate('record', {$inc: {seq: 1}}, {new: true}).then(counter => {
      this.number = counter.seq
      next()
    })
  } else {
    // 编辑时不更新单号
    next()
  }
})

exports.Record = mongoose.model('Record', RecordSchema);
exports.HistoryRecord = mongoose.model('HistoryRecord', HistoryRecordSchema);
