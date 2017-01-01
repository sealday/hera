/**
 * Created by seal on 26/12/2016.
 */
'use strict';

// console.log 总是安全
(function(global) {
  'use strict';
  if (!global.console) {
    global.console = {};
  }
  var con = global.console;
  var prop, method;
  var dummy = function() {};
  var properties = ['memory'];
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
  'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
  'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) if (!con[prop]) con[prop] = {};
  while (method = methods.pop()) if (typeof con[method] !== 'function') con[method] = dummy;
  // Using `this` for web workers & supports Browserify / Webpack.
})(typeof window === 'undefined' ? this : window);

$(function () {

  adminLogic();

  // 创建订单页面
  // 设置默认时间为今天
  var dateElement = $('#date');
  if (!dateElement.val()) {
    dateElement.val(moment(new Date()).format('YYYY-MM-DD'));
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

  if (Cookies.get('project.name')) {
    //var name = Cookies.get('project.name');
    //var projectId = Cookies.get('project.id');
    //$('#current-project').html(name + '<span class="caret">');
    //
    //$('.project-store').removeClass('active');
    //$('#project-store-' + name).addClass('active');
    //
    //$('#order-create-buy-a').attr('href', ('/project/' + projectId + '/purchase/create'));
    //$('#order-create-sell-a').attr('href', ('/project/' + projectId + '/order/create?type=sell'));
    //$('#order-create-out-a').attr('href', ('/project/' + projectId + '/order/create'));
    //$('#order-create-in-a').attr('href', ('/project/' + projectId + '/order/create'));
  }

  // 首页选择项目
  $('.current-project-a').click(function(e) {
    //e.preventDefault();
    //var name = $(this).text();
    //var projectId = $(this).attr('data-id');
    //$('#current-project').html(name + '<span class="caret">');
    //// 切换项目！
    //$('.project-store').removeClass('active');
    //$('#project-store-' + name).addClass('active');
    //
    //$('#order-create-buy-a').attr('href', ('/project/' + projectId + '/purchase/create'));
    //$('#order-create-sell-a').attr('href', ('/project/' + projectId + '/order/create?type=sell'));
    //$('#order-create-out-a').attr('href', ('/project/' + projectId + '/order/create'));
    //$('#order-create-in-a').attr('href', ('/project/' + projectId + '/order/create'));

    //Cookies.set('project.name', name);
    //Cookies.set('project.id', projectId);
  });
});

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
        if (data.indexOf('失败') != -1) {
          location.href = userPath + '?error=' + data;
        } else {
          location.href = userPath + '?info=' + data;
        }
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

function generateTable(selector, columns) {
  var dataTable = $(selector).DataTable({
    //select: {
    //  style: 'single'
    //},
    pageLength: 50,
    data: [],
    columns: columns,
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

function calculateSize(size) {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
}
