/**
 * Created by xin on 2017/2/17.
 */

import React,{Component} from 'react'
import PayAblesForm from './PayAblesForm'
import {payables} from '../actions'
import {connect} from 'react-redux'

class PayAbles extends Component{

    handleSubmit=(data)=>{
        this.props.dispatch(payables(data))
    }

    render(){
        return(
            <div>
                <h2>
                    应付查询
                </h2>
                <PayAblesForm onSubmit={this.handleSubmit}/>
            </div>
        )
    }
}

const mapStateToProps = state => {

    return {

    }
}
export default connect(mapStateToProps)(PayAbles)

