$(function() {
  orderCreate();
});

function orderCreate() {
  var columns = [
    { title: '名称', data: 'name' },
    { title: '规格', data: 'size' },
    { title: '单价', data: 'price' },
    { title: '数量', data: 'count' },
    { title: '数量小计', data: 'total' },
    { title: '价格小计', data: 'totalPrice' }
  ];
  var dataTable = generateTable('#details', columns);

  var addForm = $('#add-form');
  var orderEntries = [];

  addForm.submit(function (e) {
    e.preventDefault();

    var name = addForm.find('input[name=size]').val();
    var size = addForm.find('input[name=size]').val();
    var count = addForm.find('input[name=count]').val();

    if (!name) {
      addForm.find('input[name=name]').focus();
      return;
    } else if (!size) {
      addForm.find('input[name=size]').focus();
      return;
    } else if (!count) {
      addForm.find('input[name=count]').focus();
      return;
    }

    var target = $(e.target).serializeArray();
    var entry = {};
    target.forEach(function (obj) {
      entry[obj.name] = obj.value;
    });

    for (var i = 0; i < orderEntries.length; i++) {
      if (orderEntries[i].name == entry.name && orderEntries[i].size == entry.size) {
        alert('请注意，你输入了重复的物料！');
        return;
      }
    }

    // 检查count是否可以计算
    try {
      entry.count = eval(entry.count);
    } catch (e) {
      alert('在数量一栏中输入了不正确的表达式');
      return;
    }

    orderEntries.push(entry);

    // TODO 计算小计
    if (isNaN(entry.size)) {
      entry.total = entry.count.toFixed(2);
    } else {
      entry.total = (entry.size * entry.count).toFixed(2);
    }

    entry.totalPrice = entry.total * entry.price;
    dataTable.row.add(entry).draw(false);

    // 将内容放入表单中
    // 采用这种方式而不是直接在html中添加，是考虑到后续需要增加删除的功能
    var entries = orderEntries.map(function (entry) {
      return "<input name='entries' value='" + JSON.stringify(entry) + "'>";
    });
    $('#order-create-form').find('.hidden-content').html(entries.join(''));

    // 重新定位到第一项
    addForm.find('input[name=size]').val('');
    addForm.find('input[name=count]').val('');
    addForm.find('input[name=price]').val('');
    addForm.find('input[name=size]').focus();
  });

  var productTypesString;
  var productTypeArray = [];
  var productTypes = {};
  if (productTypesString = $('#productTypes').text()) {
    productTypeArray = JSON.parse(productTypesString);
    productTypeArray.forEach(productType => {
      productTypes[productType.name] = productType;
    });
  };

  $('#size').focus(function () {
    var name = $('#name').val();
    var size = [];

    if (productTypes[name.trim()]) {
      size = productTypes[name.trim()].sizes;
    } else {
      size = [];
    }

    var sizeList = [];
    size.forEach(function (s) {
      sizeList.push('<option>' + s + '</option>');
    });

    $('#size-list').html(sizeList.join());
  });

  // 提交表单
  $('#order-create-button').click(function () {
    $('#order-create-form').submit();
  });

}
