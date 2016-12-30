$(function() {
  orderCreate();
});

function tableLogic() {
  var dataTable = $('#details').DataTable({
    //responsive: true,
    select: {
      style: 'single'
    },
    buttons: ['copy', 'excel', 'pdf'],
    data: [],
    columns: [
      { title: '名称', data: 'name' },
      { title: '规格', data: 'size' },
      { title: '数量', data: 'count' },
      { title: '小计', data: 'total' }],
    language: {
      "decimal": "",
      "emptyTable": "还没有添加数据",
      "info": "总共 _TOTAL_ 条，显示第 _START_ 条 到第 _END_ 条的数据",
      "infoEmpty": "总共 0 条，显示第 0 条 到第 0 条的数据",
      "infoFiltered": "(filtered from _MAX_ total entries)",
      "infoPostFix": "",
      "thousands": ",",
      "lengthMenu": "每页显示 _MENU_ 条",
      "loadingRecords": "加载中...",
      "processing": "处理中...",
      "search": "搜索:",
      "zeroRecords": "没有匹配的记录",
      "paginate": {
        "first": "第一页",
        "last": "最后一页",
        "next": "下一页",
        "previous": "上一页"
      },
      "aria": {
        "sortAscending": ": 顺序排列",
        "sortDescending": ": 逆序排列"
      },
      select: {
        cells: " %d 单元格选中 ",
        columns: " 选中了 %d 列 ",
        rows: " 选中了 %d 行 "
      }
    }
  });

  // TODO 当熟悉的时候可以考虑去掉暴露到环境中，不过个人理解是留在这里也是OK的，可以考虑换个名字避免冲突就好
  return window.dataTable = dataTable;
}

function orderCreate() {
  var dataTable = tableLogic();

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
    dataTable.row.add(entry).draw(false);

    // 将内容放入表单中
    // 采用这种方式而不是直接在html中添加，是考虑到后续需要增加删除的功能
    var entries = orderEntries.map(function (entry) {
      return "<input name='entry' value='" + JSON.stringify(entry) + "'>";
    });
    $('#order-create-form').find('.hidden-content').html(entries.join(''));

    // 重新定位到第一项
    addForm.find('input[name=size]').val('');
    addForm.find('input[name=count]').val('');
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
    console.log(productTypes);
  };

  //$('#name').focus(function() {
  //  var type = $('#type').val();
  //  if (type == '租赁类') {
  //
  //  } else if (type == '耗损类') {
  //
  //  }
  //});

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

