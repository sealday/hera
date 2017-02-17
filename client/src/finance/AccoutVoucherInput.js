/**
 * Created by xin on 2017/2/17.
 */
import React, {Component} from 'react'
import './finance.css'

class AccoutVoucherInput extends Component {
    handleSubmit = {}

    render() {
        return (
            <div>
                <h2>记账凭证</h2>
                <div className="col-md-7">
                    <form onSubmit={this.handleSubmit} className="form-inline">
                            <div className=" form-group">
                                <label htmlFor="" className="control-label">凭证编号</label>

                                    <input type="text" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="control-label">日期</label>
                                    <input type="text" className="form-control"/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="control-label">附件</label>
                                    <input type="text" className="form-control"/>
                                <label htmlFor="" className="control-label">张</label>
                            </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <td className="col-md-1">

                                    </td>
                                    <td className="col-md-2" >摘要</td>
                                    <td className="col-md-2" >科目</td>
                                    <td className="col-md-2" >借方金额   贷方金额</td>
                                </tr>

                            </thead>
                            <tbody>
                            <tr>
                                <td className="col-md-1">
                                    *
                                </td>
                                <td className="col-md-2" contentEditable={true} ></td>
                                <td className="col-md-2" contentEditable={true} ></td>
                                <td className="col-md-2" contentEditable={true} ></td>
                            </tr>
                            <tr>
                                <td  className="col-md-7 edittr" contentEditable={true}></td>
                            </tr>
                            <tr>
                                <td className="col-md-1">数量</td>
                                <td className="col-md-1" ></td>
                                <td className="col-md-1">单价</td>
                                <td className="col-md-1" ></td>
                                <td rowSpan="2" className="col-md-3">合计</td>
                            </tr>
                            <tr>
                                <td className="col-md-1">项目</td>
                                <td  className="col-md-1"></td>
                                <td className="col-md-1">部门</td>
                                <td contentEditable={true} className="col-md-1"></td>
                            </tr>

                            </tbody>

                        </table>
                    </form>
                </div>
            </div>


        )

    }
}

export default AccoutVoucherInput
