const mongo = require('mongodb');
const mongoose = require('mongoose');
const Product = require('../models').Product;
const Record = require('../models').Record;
const fs = require('fs');

const calculateSize = sizeStr => {
  if (!sizeStr) return 1 // 未定义、空等情况返回1
  let size = sizeStr.split(';').pop();
  if (isNaN(size)) {
    return 1;
  } else {
    return Number(size);
  }
}

(async () => {
	const client = await mongo.connect('mongodb://127.0.0.1')
	const db = client.db('hera2017');
	const products = db.collection('products');
	const items = await products.find().toArray();
	// 读取原来的数据
	const prepared_items = [];
	let num = 0;
	const productMap = {};
	items.forEach(item => {
		if (item.sizes && item.sizes.length > 0) {
			item.sizes.forEach(size => {
				num++;
				const product = {
					type: item.type,
					number: num,
					model: num,
					name: item.name,
					size: size, 
					countUnit: item.countUnit, 
					weight: 0, 
					unit: item.unit,
					scale: calculateSize(size),
					isScaled: true,
					pinyin: item.pinyin,			
				}
				prepared_items.push(product);
				productMap[item.name + size] = product;
			});
		} else {
			num++;
			const product = {
				type: item.type,
				number: num,
				model: num,
				name: item.name,
				size: '', 
				countUnit: item.countUnit, 
				weight: 0, 
				unit: item.unit,
				scale: 1,
				isScaled: true,
				pinyin: item.pinyin,			
			};
			prepared_items.push(product);
			productMap[item.name] = product;
		}
	});
	await mongoose.connect('mongodb://localhost/hera2017');

	await products.drop();
	await Product.create(prepared_items);

	// 输出新格式的数据
	const records = await Record.find();
	const prepared_records = [];
	records.forEach(record => {
		const entries = [];
		record.entries.forEach(entry => {
			const key = entry.name + (entry.size ? entry.size : '');
			const product = productMap[key];
			if (!product) {
				console.log('单号：' + record.number);
				console.log(entry.name + entry.size);
			} else {
				entry.number = product.number;
				entries.push(entry);
			}
		});
		prepared_items.push(record.save());
	});

	await Promise.all(prepared_items);

	await client.close();
	await mongoose.disconnect();
})().catch(err => {
	console.log(err);
});
