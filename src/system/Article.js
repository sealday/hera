/**
 * Created by seal on 11/01/2017.
 */
import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import { connect } from 'react-redux'

/**
 * 基础物料
 */
class Article extends Component {
  render() {
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
          {this.props.articles.map((article, index) => {
            return (
              <tr key={article._id}>
                <td>{article.type}</td>
                <td>{article.name}</td>
                <td><TagsInput inputProps={{placeholder: "输入新规格"}} value={article.sizes} onChange={tags => {
                  this.setState(prevState => {
                    // TODO 深度克隆对象？
                    prevState.articles[index].sizes = tags;
                    return { articles: prevState.articles };
                  })
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
}

const mapStateToProps = state => {
  return {
    articles: state.articles
  }
}

export default connect(mapStateToProps)(Article);
