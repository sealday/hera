/**
 * Created by wangjiabao on 2017/2/9.
 * 签到
 */

import React, {Component} from 'react'
import moment from 'moment';
import  './signin.css'


class Signin extends Component {
    render() {
        return (
            <div className="col-md-12">
                <h2>签到</h2>
                <div className="datecontainer">
                    <div className="datetext">
                        {moment().format('YYYY-MM-DD,dddd')}
                    </div>
                </div>

                <div className="maincontainer">
                    <div className="defaulttime">
                        默认班次
                    </div>
                    <div className="line"></div>
                    <div className="signcontainer">
                        <div className="col-md-9">
                            <div className="towork">
                                上班：09：00
                            </div>
                            <div>
                                下班：18：00
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="signinbutton">
                                <div className="signintext">
                                    <div>签到</div>
                                    <div className="signtimetext">22:12:34</div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="form-group">
                        <label>备注</label>
                        <input type="text" className="form-control" placeholder="请填写备注"/>
                    </div>
                    <div>
                        <button className="btn btn-primary btn-block">提交</button>
                    </div>
                </div>

            </div>
        )
    }
}


export default Signin


