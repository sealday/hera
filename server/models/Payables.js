/**
 * Created by xin on 2017/2/19.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PayableSchema = new Schema({
    number:String,//流水号
    originOrder:String,
    outDate:Date,
    vendor: String, // 对方单位，采购单和销售单专用
    entries:[
        {
            type: { // 类型
                type: String
            },
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
        }
    ],
    hasTransport: { type: Boolean, default: false }, // 是否有对应运输单
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
    }
});

const Payables = mongoose.model('Payables', PayableSchema);

module.exports = Payables;

