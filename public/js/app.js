/**
 * Created by seal on 26/12/2016.
 */

'use strict';

$(function () {

  adminLogic();

  // 创建订单页面
  // 设置默认时间为今天
  var dateElement = $('#date').get(0);
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
    var tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    $('#arrival-date').get(0).valueAsDate = tomorrow;
  }

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
    columns: [{ title: '名称' }, { title: '规格' }, { title: '数量' }, { title: '小计' }],
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

    var row = [];
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
    var entries = orderEntries.map(function (entry) {
      return "<input name='entry' value='" + JSON.stringify(entry) + "'>";
    });
    $('#order-create-form').find('.hidden-content').html(entries.join(''));

    // 重新定位到第一项
    addForm.find('input[name=size]').val('');
    addForm.find('input[name=count]').val('');
    addForm.find('input[name=size]').focus();
  });

  $('#size').focus(function () {
    var name = $('#name').val();
    var size = [];
    switch (name) {
      case '钢管':
        size = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6];
        break;
      case '扣件':
        size = ['十字', '转向', '直接'];
        break;
      default:
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


  // 首页选择项目
  $('.current-project-a').click(function(e) {
    e.preventDefault();
    $('#current-project').text($(this).text());
    // 切换项目！
  });
}

/**
 * 管理页面 js 逻辑
 */
function adminLogic() {
  var userPath = '/control';
  // 用户修改
  $('.user-modify-form').submit(function(e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    $.post('/user/' + id, $(this).serialize()).then(function(data) {
      location.href = userPath+ '?info=' + data;
    }, errHandler);
  });

  // 用户添加
  $('#user-add-form').submit(function (e) {
    e.preventDefault();
    $.post('/user', $(e.target).serialize()).then(function(data) {
      location.href = userPath + '?info=' + data;
    }, errHandler);
  });

  // 用户删除按钮
  $('.user-delete-button').click(function (e) {
    e.preventDefault();
    var id = $(e.target).attr('data-id');
    var username = $(e.target).attr('data-username');

    if (confirm('确定要删除操作员' + username + '')) {
      $.post('/user/' + id + '/delete').then(function (data) {
        location.href = userPath + '?info=' + data;
      }, errHandler);
    }
  });

  // 用户增加按钮控制
  $('#user-add-form').on('show.bs.collapse', function () {
    $('#user-add-button').text('取消')
  });

  $('#user-add-form').on('hide.bs.collapse', function () {
    $('#user-add-button').text('增加')
  });

  var projectPath = '/control';
  // 项目修改
  $('.project-modify-form').submit(function(e) {
    console.dir(e);
    debugger;
    e.preventDefault();
    var id = $(this).attr('data-id');
    $.post('/project/' + id, $(this).serialize()).then(function() {
      location.href = projectPath + '?info=更新项目成功！';
    }, errHandler);
  });

  // 项目添加
  $('#project-add-form').submit(function (e) {
    e.preventDefault();
    $.post('/project', $(e.target).serialize()).then(function () {
      location.href = projectPath + '?info=添加项目成功！'
    }, errHandler);
  });

  // 项目删除按钮
  $('.project-delete-button').click(function (e) {
    e.preventDefault();
    var id = $(e.target).attr('data-id');
    var username = $(e.target).attr('data-project');

    if (confirm('确定要删除项目' + username + '')) {
      $.post('/project/' + id + '/delete').then(function () {
        location.href = projectPath + '?info=删除成功！';
      }, errHandler);
    }
  });

  // 项目增加按钮控制
  $('#project-add-form').on('show.bs.collapse', function () {
    $('#project-add-button').text('取消')
  });
  $('#project-add-form').on('hide.bs.collapse', function () {
    $('#project-add-button').text('增加')
  });

  var contactElement = '<div class="form-group"><label class="control-label col-sm-2">联系人</label><div class="col-sm-2"><input class="form-control" name="contact.name" type="text" value=""></div><label class="control-label col-sm-2">联系人电话</label><div class="col-sm-6"><div class="input-group"><input class="form-control" name="contact.phone" type="text" value=""><span class="input-group-btn"><a class="btn btn-default contact-plus-button"><span class="glyphicon glyphicon-plus"></span></a></span><span class="input-group-btn"><a class="btn btn-default contact-minus-button"><span class="glyphicon glyphicon-minus"></span></a></span></div></div></div>';
  $('.contact-group').click(function(e) {
    var length = $(this).attr('data-length');
    e.preventDefault();
    if ($(e.target).hasClass('contact-plus-button') || $(e.target).parent().hasClass('contact-plus-button')){
      length++;
      $(this).append(contactElement);
    } else if ($(e.target).hasClass('contact-minus-button') || $(e.target).parent().hasClass('contact-minus-button')) {
      if (length > 1) {
        $(e.target).closest('.form-group').remove();
        length--;
      }
    }
    $(this).attr('data-length', length);
  });
}

function errHandler(err) {
  alert('出错了，请稍后重试，或者联系负责！');
  console.log(err);
}