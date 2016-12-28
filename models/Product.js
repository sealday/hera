const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new Schema({
  type: String,
  name: String,
  size: String, // 规格
  count: Number, // 数量
  total: Number, // 小计
  orderId: ObjectId,
});

// 在这里调用具体的运算规则
// 使用中间件的形式，来保存total变量
//productSchema.pre('save', function(next) {
//  // TODO 把计算规则存储到数据库中，方便更改和查看
//  switch (this.get('name')) {
//    case '钢管':
//      this.set('total', this.get('count') * this.get('size'));
//      break;
//    case '扣件':
//      // TODO 扣件固定为30 修改成 1
//      this.set('total', this.get('count') * 1);
//      break;
//    case '套筒':
//      if (size === '10cm') {
//        this.set('total', this.get('count') * 50);
//      } else if (size === '20cm') {
//        this.set('total', this.get('count') * 30);
//      } else if (size === '30cm') {
//        this.set('total', this.get('count') * 20);
//      }
//      break;
//    default:
//      this.set('total', this.get('count'));
//  }
//
//  next();
//});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
