/**
 * Created by seal on 11/01/2017.
 */
import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';

/**
 * 基础物料
 */
class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
  }

  componentDidMount() {
    fetch('/api/article').then(res => res.json())
      .then(articles => {
        this.setState({articles});
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  }

  componentWillUnmount() {

  }

  handleChange(tags) {

  }

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
          {/*{*/}
            {/*type: '租赁类',*/}
            {/*name: '钢管',*/}
            {/*sizes: ["0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0","1.1","1.2","1.3","1.4","1.5","1.6","1.7","1.8","1.9","2","2.1","2.2","2.3","2.4","2.5","2.6","2.7","2.8","2.9","3","3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8","3.9","4","4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8","4.9","5","5.1","5.2","5.3","5.4","5.5","5.6","5.7","5.8","5.9","6"],*/}
            {/*sizeUnit: '米',*/}
            {/*countUnit: '根',*/}
            {/*unit: '米'*/}
          {/*},*/}
          {this.state.articles.map((article, index) => {
            return (
              <tr key={article._id}>
                <td>{article.type}</td>
                <td>{article.name}</td>
                <td><TagsInput value={article.sizes} onChange={tags => {
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

export default Article;
