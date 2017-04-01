现在的产品类型设计是这样的结构，并且数据还存放在每一个订单中的具体项目中
const productSchema = new Schema({
  type: String,
  name: String,
  sizes: [String],
  unit: String,
  sizeUnit: String,
  countUnit: String,
  convert: Number, // 折合数量级
  convertUnit: String, // 折合单位

  pinyin: String, // 产品名称的拼音
});

为了减少查询时候的麻烦，我最初的选择是将这部分数据直接存放到了所有使用到他的表
中，这样子产生的问题是如果更新规格的话，没有如何变化的根据，我只能根据理论上的
name+size是唯一的来变化，但是这样子更新很不方便。另一方面，也是最大的麻烦，就是
前台在进行某些处理的时候，也是要通过name+size，而size有时候还会是空的，也要特殊
处理，这些都让我决定改进这个结构。
这次改变将沿用原本的思想，但是加入一个 id 来标记对应的内容。
