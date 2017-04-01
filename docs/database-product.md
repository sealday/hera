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

原本要从类型名称中推断出如何换算就是一个错误的决定，仅存的意义只是为了能少重复
一些输入，哪怕这些输入其实可以在录入的时候帮用户推断出来。

新的模型中将这个问题解决了。

针对有些没有规格的产品，我还没有很好的思路要怎么处理，关键是，我要想一下，为什么
要特殊处理，以及如果特殊处理我要怎么做，如果不特殊处理我应该怎么做？

因为我们这里不考虑一直嵌套的问题，所以我们进行特殊处理，就只有规格会出现有无的现象，
如果没有规格，我们在选择的时候禁用掉对规格的检查，灰化处理，以及禁止他的使用


// 这是目前给出的初步原型，接下去是试验一下这个原型在功能上会有什么缺失
const productSchema = new Schema({
    type: String,
    name: String,
    sizes: [{
        name: String,
        unit: String,
        scale: Number, // 比例
        pinyin: String,
    }],
    unit: String,
    pinyin: String,
});

