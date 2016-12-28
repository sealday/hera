/**
 * Created by seal on 26/12/2016.
 */

$(() => {
  // 管理员界面
  $('.user-delete-button').click(function(e) {
    e.preventDefault();
    let id = $(e.target).attr('data-id');
    let username = $(e.target).attr('data-username');

    if (confirm('确定要删除操作员' + username + '')) {
      $.post('/user/' + id + '/delete').then(function() {
        location.href = '/project?info=删除成功！';
      }, function(err) {
        alert('删除出错了，稍后重试！');
      });
    }
  });

  $('.project-delete-button').click(function(e) {
    e.preventDefault();
    let id = $(e.target).attr('data-id');
    let username = $(e.target).attr('data-project');

    if (confirm('确定要删除项目' + username + '')) {
      $.post('/project/' + id + '/delete').then(function() {
        location.href = '/project?info=删除成功！';
      }, function(err) {
        alert('删除出错了，稍后重试！');
      });
    }
  });

  // 创建订单页面
  // 设置默认时间为今天
  const dateElement = $('#date').get(0);
  if (dateElement instanceof HTMLInputElement) {
    dateElement.valueAsDate = new Date();
  }


  // 运输协议填写界面
  // 出发日期
  if ($('#off-date').get(0) instanceof HTMLInputElement) {
    $('#off-date').get(0).valueAsDate = new Date();
  }

  // 运输协议填写界面
  // 到达日期
  if ($('#arrival-date').get(0) instanceof HTMLInputElement) {
    let tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    $('#arrival-date').get(0).valueAsDate = tomorrow;
  }


  orderCreate();
});

function tableLogic() {
  const dataTable = $('#details').DataTable({
    //responsive: true,
    select: true,
    buttons: [
      'copy', 'excel', 'pdf'
    ],
    data: [],
    columns: [
      { title: '名称' },
      { title: '规格' },
      { title: '数量' },
      { title: '小计' },
    ],
    language:  {
      "decimal":        "",
      "emptyTable":     "还没有添加数据",
      "info":           "总共 _TOTAL_ 条，显示第 _START_ 条 到第 _END_ 条的数据",
      "infoEmpty":      "总共 0 条，显示第 0 条 到第 0 条的数据",
      "infoFiltered":   "(filtered from _MAX_ total entries)",
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "每页显示 _MENU_ 条",
      "loadingRecords": "加载中...",
      "processing":     "处理中...",
      "search":         "搜索:",
      "zeroRecords":    "没有匹配的记录",
      "paginate": {
        "first":      "第一页",
        "last":       "最后一页",
        "next":       "下一页",
        "previous":   "上一页"
      },
      "aria": {
        "sortAscending":  ": 顺序排列",
        "sortDescending": ": 逆序排列"
      }
    }
  });

  // TODO 当熟悉的时候可以考虑去掉暴露到环境中，不过个人理解是留在这里也是OK的，可以考虑换个名字避免冲突就好
  //return window.dataTable = dataTable;
  return dataTable;
}


function orderCreate() {

  const dataTable = tableLogic();

  const addForm = $('#add-form');
  let orderEntries = [];

  addForm.submit((e) => {
    e.preventDefault();

    const name = addForm.find('input[name=size]').val();
    const size = addForm.find('input[name=size]').val();
    const count = addForm.find('input[name=count]').val();

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

    const target = $(e.target).serializeArray();
    let entry = {};
    target.forEach(obj => {
      entry[obj.name] = obj.value;
    });


    for (let i = 0; i < orderEntries.length; i++) {
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



    let row = [];
    row.push(entry.name);
    row.push(entry.size);
    row.push(entry.count);

    // TODO 计算小计
    if (isNaN(entry.size)) {
      row.push(entry.total = entry.count.toFixed(2));
    } else {
      row.push(entry.total = (entry.size * entry.count).toFixed(2));
    }
    dataTable.row.add(row).draw(false);

    // 将内容放入表单中
    // 采用这种方式而不是直接在html中添加，是考虑到后续需要增加删除的功能
    const entries = orderEntries.map(entry => {
      return "<input name='entry' value='" + JSON.stringify(entry) + "'>"
    });
    $('#order-create-form')
      .find('.hidden-content')
      .html(entries.join(''));

    // 重新定位到第一项
    addForm.find('input[name=size]').val('');
    addForm.find('input[name=count]').val('');
    addForm.find('input[name=size]').focus();

  });

  $('#size').focus(() => {
    const name = $('#name').val();
    let size = [];
    switch(name) {
      case '钢管':
        size = [
          1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,
          2,2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,
          3,3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,
          4,4.1,4.2,4.3,4.4,4.5,4.6,4.7,4.8,4.9,
          5,5.1,5.2,5.3,5.4,5.5,5.6,5.7,5.8,5.9,
          6];
        break;
      case '扣件':
        size = [
          '十字',
          '转向',
          '直接',
        ];
        break;
      default:
        size = [];
    }

    let sizeList = [];
    size.forEach(s => {
      sizeList.push('<option>' + s +'</option>');
    });

    $('#size-list').html(
      sizeList.join()
    )
  });

  // 提交表单
  $('#order-create-button').click(() => {
    $('#order-create-form').submit();
  });
}

