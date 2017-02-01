/**
 * Created by seal on 11/01/2017.
 */
import React from 'react';
import TagsInput from 'react-tagsinput';
import { connect } from 'react-redux'
import { updateArticleSizes } from '../actions'

/**
 * 基础物料
 */
function Article ({articles, dispatch}){
  console.log(articles)
  return (
    <div>
      <p>说明，1根 0.4米 的钢管，其中"根"是数量单位，"米"是规格单位</p>
      <p>说明，1只 直接 的扣件，其中"只"是数量单位，扣件无规格单位</p>
      <p>如果有规格单位，规格单位作为小计时显示的单位</p>
      <p>如果没有规格单位，数量单位作为小计时显示的单位</p>
      <table className="table">
        <thead>
        <tr>
          <th>类别</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量单位</th>
          <th>规格单位</th>
          <th>换算单位</th>
        </tr>
        </thead>
        <tbody>
        {articles.map(article => {
          return (
            <tr key={article.name}>
              <td>{article.type}</td>
              <td>{article.name}</td>
              <td><TagsInput inputProps={{placeholder: "输入新规格"}} value={article.sizes} onChange={sizes => {
                dispatch(updateArticleSizes(article._id, sizes))
              }} /></td>
              <td>{article.countUnit}</td>
              <td>{article.unit}</td>
              <td> </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    articles: state.system.articles.toArray()
  }
}

export default connect(mapStateToProps)(Article);
