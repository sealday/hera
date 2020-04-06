import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { 
  Avatar,
  Button,
  CssBaseline,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { 
  LockOutlined as LockOutlinedIcon,
} from '@material-ui/icons'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { message } from 'antd'
import 'antd/lib/message/style/css'
import axios from 'axios'

import { wrapper } from './utils'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
})

const Login = ({ dispatch, classes }) => {

  const [company, setCompany] = useState('上海创兴建筑设备租赁有限公司')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/login', {
        company, username, password
      })
      localStorage.setItem('X-Hera-Token', res.data.access_token)
      dispatch(push('/dashboard'))
    } catch {
      message.error('登录失败，请检查账号或者密码是否有问题！');
    }
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          赫拉管理系统
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="company">公司</InputLabel>
            <Select id="company" name="company" onChange={e => setCompany(e.target.value)} value={company}>
              <MenuItem value="上海创兴建筑设备租赁有限公司">上海创兴建筑设备租赁有限公司</MenuItem>
            </Select>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">操作员</InputLabel>
            <Input onChange={e => setUsername(e.target.value)} id="username" name="username" autoFocus autoComplete="username" value={username} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">密码</InputLabel>
            <Input onChange={e => setPassword(e.target.value)} name="password" type="password" id="password" autoComplete="current-password" value={password} />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            登录
          </Button>
        </form>
      </Paper>
    </main>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default wrapper([
  connect(),
  withStyles(styles),
  Login,
])