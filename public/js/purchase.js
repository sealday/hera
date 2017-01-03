$(function() {
  orderCreate();
});

function getProductTypes() {
  var productTypesString;
  var productTypeArray = [];
  var productTypes = {};
  if (productTypesString = $('#productTypes').text()) {
    productTypeArray = JSON.parse(productTypesString);
    productTypeArray.forEach(productType => {
      productTypes[productType.name] = productType;
    });
  }
  return productTypes;
}

// 计算
function calculateEntry(entry) {
  entry.total = (calculateSize(entry.size) * entry.count).toFixed(2);

  entry.sum = entry.total * entry.price;
  entry.button = '<button class="btn btn-danger action-delete" ' +
    'data-name="' + entry.name + '" data-size="' + entry.size +'">删除</button>'

  if (entry.fee) {
    if (entry.feeType == '趟') {
      entry.feeSum = entry.fee * 1;
      entry.feeCount = 1;
    } else if (entry.feeType == '吨') {
      // 计算多少吨
      entry.feeCount = '待计算';
      entry.feeSum = entry.fee * 1;
    }

  } else {
    entry.fee = 0;
    entry.feeSum = 0;
    entry.feeType = '无';
  }

  entry.mixSum = entry.sum + entry.feeSum;
  entry.mixPrice = (entry.mixSum / entry.total).toFixed(2);
}

function orderCreate() {
  var columns = [
    { title: '名称', data: 'name' },
    { title: '规格', data: 'size' },
    { title: '数量', data: 'count' },
    { title: '小计', data: 'total' },
    { title: '单位', data: 'unit' },
    { title: '单价', data: 'price' },
    { title: '金额', data: 'sum' },
    { title: '顿/趟', data: 'feeCount' },
    { title: '运费单位', data: 'feeType' },
    { title: '运费单价', data: 'fee' },
    { title: '运费', data: 'feeSum' },
    { title: '综合金额', data: 'mixSum' },
    { title: '综合单价', data: 'mixPrice' },
    { title: '', data: 'button'}
  ];

  var productTypes = getProductTypes();

  var addFormVue = new Vue({
    el: '#add-form',
    data: {
      name: '',
      freight: false,
      feeType: '吨',
      fee: '',
      unit: '',
      feeCount: 0
    },
    watch: {
      name: function (val, oldVal) {
        if (productTypes[val]) {
          addFormVue.unit = productTypes[val].unit;
        }
      }
    }
  });
  window.addFormVue = addFormVue;

  var dataTable = generateTable('#details', columns);

  var addForm = $('#add-form');
  var orderEntries = [];

  $('#order-create-form').find('.hidden-content').find('input').each(function() {
    var entry = JSON.parse($(this).val());

    calculateEntry(entry);

    dataTable.row.add(entry).draw(false);
  });

  $('#details').click(function(e) {
    var name = $(e.target).attr('data-name');
    var size = $(e.target).attr('data-size');
    if ($(e.target).hasClass('action-delete')) {
      for (var i = 0; i < orderEntries.length; i++) {
        if (orderEntries[i].name == name && orderEntries[i].size == size) {
          orderEntries.splice(i, 1);
          break;
        }
      }
      dataTable
        .row( $(e.target).parents('tr') )
        .remove()
        .draw();
    } else if ($(e.target).hasClass('action-modify')) {
      var entry;
      for (var i = 0; i < orderEntries.length; i++) {
        if (orderEntries[i].name == name && orderEntries[i].size == size) {
          entry = orderEntries.splice(i, 1);
          break;
        }
      }
      addForm.find('input[name=type]').val(entry[0].type);
      addForm.find('input[name=name]').val(entry[0].name);
      addForm.find('input[name=size]').val(entry[0].size);
      addForm.find('input[name=price]').val(entry[0].price);
      addForm.find('input[name=count]').val(entry[0].count);
    }
  });

  addForm.submit(function (e) {
    e.preventDefault();

    var name = addForm.find('input[name=name]').val();
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

    calculateEntry(entry);

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

  var productTypes = getProductTypes();

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
