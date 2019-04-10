import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue';

export default createMuiTheme({
  palette: {
    primary: blue,
  }, 
  overrides: {
    MuiCollapse: {
      entered: {
        height: "auto",
        overflow: "visible"
      }
    },
    MuiCard: {
      root: {
        overflow: "visible"
      }
    }
  }
});
