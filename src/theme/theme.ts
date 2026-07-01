import { createTheme } from '@mui/material/styles'

// NOVA design tokens — see plan/spec for exact figures. Nova Blue is used
// sparingly (AI Styling nav, links, hover states, Best tag, selected states).
export const colors = {
  background: '#F8F8F8',
  white: '#FFFFFF',
  warmBeige: '#EAE3D9',
  novaBlue: '#3157FF',
  textPrimary: '#111111',
  textSecondary: '#555555',
  textMuted: '#888888',
  borderLight: '#E5E5E5',
  borderMedium: '#DCDCDC',
  sale: '#E5484D',
  best: '#3157FF',
  new: '#111111',
  aiPick: '#6B5BFF',
  soldOut: '#BDBDBD',
}

const fontFamily = ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'].join(',')

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.novaBlue, contrastText: colors.white },
    background: { default: colors.background, paper: colors.white },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
  },
  typography: {
    fontFamily,
    h1: { fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-2px' },
    h2: { fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-1px' },
    body1: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, color: colors.textMuted },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: 'none' },
      },
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})
