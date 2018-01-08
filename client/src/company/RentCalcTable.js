/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'

/**
 * 提供排序功能的搜索结果表
 */
class SimpleSearchTable extends React.Component {

  render() {
    const { search } = this.props

    return <pre>
      { JSON.stringify(search, null, 4) }
    </pre>
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  store: state.system.store,
})

export default connect(mapStateToProps)(SimpleSearchTable)