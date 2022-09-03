import { IfShow } from ".";

export default ({ message }) => <div><IfShow cond={message} ifNot='出错了'>{message}</IfShow></div>