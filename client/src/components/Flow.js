import React from 'react'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

const Flow = ({ items, className }) => (
  <Card className={className}>
    <CardHeader
      title="流程"
      action={
        <Button color="primary">刷新</Button>
      }
    />
    <Table className="Table Table-bordered">
      <TableHead>
        <TableRow>
          <TableCell>时间</TableCell>
          <TableCell>类型</TableCell>
          <TableCell>操作人</TableCell>
          <TableCell>内容详情</TableCell>
          <TableCell>操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{moment(item.datetime).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.operator}</TableCell>
            <TableCell>{item.content}</TableCell>
            <TableCell>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
)

export default Flow
