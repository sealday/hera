import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

export default createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: blue,
  }, 
  overrides: {
    MuiCollapse: {
      entered: {
        height: "auto",
        overflow: "visible",
      },
    },
    MuiButton: {
      outlinedPrimary: {
        borderStyle: 'dashed',
        '&:hover': {
          borderStyle: 'dashed',
        },
      },
    },
    MuiCard: {
      root: {
        overflow: "visible",
      },
    },
  }
});
