import { createHistory } from 'history'
import {
  useRouterHistory,
} from 'react-router'

const historyConfig = { basename: '/system'  };
export default useRouterHistory(createHistory)(historyConfig);