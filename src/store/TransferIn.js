/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';

class TransferIn extends Component {
  render() {
    return (
      <div>
        <ol className="breadcrumb">
          <li><a href="/">主页</a></li>
          <li><a href="../">a项目</a></li>
          <li><a href="./">调入列表</a></li>
          <li className="active">调入单填写</li>
        </ol>
        <h2 className="active">调入单创建</h2>
        <form>
          <div className="hidden-content" hidden=""></div>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-3">
                <select className="filter-select form-control" name="project" id="project" style={{display: 'none'}}><option value="586e30fea86efadc0fdc3e79">bbbb</option><option value="58710c2e2270aefd76044d3f">sdfasdfsdfasdf</option></select>
                <div className="btn-group bootstrap-select filter-select form-control">
                  <button type="button" className="btn dropdown-toggle form-control selectpicker btn-default" data-toggle="dropdown" data-id="project" title="bbbb"><span className="filter-option pull-left">bbbb</span>&nbsp;<span className="caret"></span></button>
                  <div className="dropdown-menu open">
                    <div className="bs-searchbox">
                      <input type="text" className="form-control" autocomplete="off" />
                    </div>
                    <ul className="dropdown-menu inner selectpicker" role="menu">
                      <li data-original-index="0" className="selected"><a tabindex="0" className="" data-normalized-text="&lt;span className=&quot;text&quot;&gt;bbbb&lt;/span&gt;" data-tokens="null"><span className="text">bbbb</span><span className="glyphicon glyphicon-ok check-mark"></span></a></li>
                      <li data-original-index="1"><a tabindex="0" className="" data-normalized-text="&lt;span className=&quot;text&quot;&gt;sdfasdfsdfasdf&lt;/span&gt;" data-tokens="null"><span className="text">sdfasdfsdfasdf</span><span className="glyphicon glyphicon-ok check-mark"></span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <label className="control-label col-md-1">日期</label>
              <div className="col-md-3">
                <input className="form-control" type="date" id="date" name="date" />
              </div>
              <label className="control-label col-md-1">原始单号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="originalOrder" name="originalOrder" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">车号</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="carNumber" name="carNumber" />
              </div>
              <label className="control-label col-md-1">车费</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="carFee" name="cost.car" />
              </div>
              <label className="control-label col-md-1">备注</label>
              <div className="col-md-3">
                <input className="form-control" type="text" id="comments" name="comments" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">整理费</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="cost.sort" />
              </div>
              <label className="control-label col-md-1">其他费用1</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="cost.other1" />
              </div>
              <label className="control-label col-md-1">其他费用2</label>
              <div className="col-md-3">
                <input className="form-control" type="text" name="cost.other2" />
              </div>
            </div>
          </div>
        </form>
        <div id="details-wrapper">
          <div id="details_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
            <div className="row">
              <div className="col-sm-6">
                <div className="dataTables_length" id="details_length">
                  <label>每页显示 <select name="details_length" aria-controls="details" className="form-control input-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> 条</label>
                </div>
              </div>
              <div className="col-sm-6">
                <div id="details_filter" className="dataTables_filter">
                  <label>搜索:<input type="search" className="form-control input-sm" placeholder="" aria-controls="details" /></label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <table className="table table-striped table-bordered table-hover dataTable no-footer" id="details" cellspacing="0" width="100%" role="grid" aria-describedby="details_info" style={{width: '100%'}}>
                  <thead>
                  <tr role="row">
                    <th className="sorting_asc" tabindex="0" aria-controls="details" rowspan="1" colspan="1" aria-sort="ascending" aria-label="名称: 逆序排列"  >名称</th>
                    <th className="sorting" tabindex="0" aria-controls="details" rowspan="1" colspan="1" aria-label="规格: 顺序排列"  >规格</th>
                    <th className="sorting" tabindex="0" aria-controls="details" rowspan="1" colspan="1" aria-label="数量: 顺序排列"  >数量</th>
                    <th className="sorting" tabindex="0" aria-controls="details" rowspan="1" colspan="1" aria-label="小计: 顺序排列"  >小计</th>
                    <th className="sorting" tabindex="0" aria-controls="details" rowspan="1" colspan="1" aria-label="操作: 顺序排列"  >操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="odd">
                    <td valign="top" colspan="5" className="dataTables_empty">还没有添加数据</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-5">
                <div className="dataTables_info" id="details_info" role="status" aria-live="polite">
                  总共 0 条，显示第 0 条 到第 0 条的数据
                  <span className="select-info"><span className="select-item"> 选中了 0 行 </span><span className="select-item"> 选中了 0 列 </span><span className="select-item"> 0 单元格选中 </span></span>
                </div>
              </div>
              <div className="col-sm-7">
                <div className="dataTables_paginate paging_simple_numbers" id="details_paginate">
                  <ul className="pagination">
                    <li className="paginate_button previous disabled" id="details_previous"><a href="#" aria-controls="details" data-dt-idx="0" tabindex="0">上一页</a></li>
                    <li className="paginate_button next disabled" id="details_next"><a href="#" aria-controls="details" data-dt-idx="1" tabindex="0">下一页</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="form-inline" id="add-form">
          <div className="form-group">
            <label className="control-label">类型</label>
            <select className="form-control" name="type" id="type"><option>租赁类</option><option>耗损类</option><option>工具类</option></select>
          </div>
          <div className="form-group">
            <label className="control-label">名称</label>
            <input className="form-control" type="text" name="name" autocomplete="off" list="name-list" id="name" />
            <datalist id="name-list"><option>扣件</option><option>套筒</option><option>顶丝</option><option>轮扣</option><option>钢笆</option><option>架子</option><option>钢管</option><option>工字钢</option><option>槽钢</option><option>方管</option></datalist>
          </div>
          <div className="form-group">
            <label className="control-label">规格</label>
            <input className="form-control" type="text" name="size" autocomplete="off" list="size-list" id="size" />
            <datalist id="size-list"></datalist>
          </div>
          <div className="form-group">
            <label className="control-label">数量</label>
            <input className="form-control" type="text" name="count" autocomplete="off" id="count" />
          </div>
          <button className="btn btn-primary" id="add">添加</button>
        </form>
        <button className="btn btn-primary btn-block" id="order-create-button">创建</button>
      </div>
    );
  }
}

export default TransferIn;
