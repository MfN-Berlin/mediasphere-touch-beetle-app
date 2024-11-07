import { createContext, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const DataContext = createContext()
const DataProvider = props => {
    const { children } = props;

    const [autoScroll, setAutoScroll] = useState(true)
    const [audioAutoplay, setAudioAutoplay] = useState(true)
    const [theme, setTheme] = useState('dark')

    return <DataContext.Provider value={{
        autoScroll,
        setAutoScroll,
        audioAutoplay,
        setAudioAutoplay,
        theme,
        toggleTheme: () => setTheme(p => p === 'light' ? 'dark' : 'light')
    }}>
        <ThemeProvider theme={createTheme({
            palette: {
                background: {
                    default: { dark: "#000000", light: '#dddddd' }[theme],
                    paper: { dark: "#222222", light: '#ffffff' }[theme],
                },
                primary: {
                    main: '#afca0b'
                },
                text: {
                    primary: { dark: "#ffffff", light: '#000000' }[theme],
                    secondary: { dark: "#bbbbbb", light: '#444444' }[theme]
                }
            },
            typography: {
                //fontFamily:"'Gruppo', sans-serif",
                h1: {
                    fontSize: "1.5rem",
                    fontWeight: '500',
                    textTransform: 'uppercase'
                },
                h2: {
                    fontSize: "1.2rem",
                    fontWeight: '500',
                    textTransform: 'uppercase'
                }
            },
            components: {
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            '&.Mui-disabled': {
                                color: { dark: 'rgba(255,255,255,0.26)', light: undefined }[theme]
                            }
                        }
                    }
                },
                MuiTooltip: {
                    defaultProps: {
                        arrow: true,
                        enterDelay:0,
                        enterTouchDelay:0
                    },
                    styleOverrides: {
                        popper:{
                            padding:'0 10px',
                           
                            //background:'red',
                            //maxWidth:'calc( 100% - 10px )'
                        },
                        tooltip: {
                            padding:'10px',
                            maxWidth:"300px",
                            textAlign:'center',
                            fontSize: '0.85rem'
                        },

                    },
                }, MuiLink: {
                    defaultProps: {
                        target: '_blank',
                        underline: 'none'
                    }, styleOverrides: {
                        root: {
                            color: { dark: 'primary.main', light: '#000' }[theme],
                            textDecoration: 'underline'

                        }
                    }
                }
            },
            extra: {
                modelHightlightColor: { dark: '#ffffff', light: '#ffffff' }[theme],
                modelDimensionsAxisColor: { dark: '#bbbbbb', light: '#888' }[theme]
            }
        })}>
            <CssBaseline />

            {children}
        </ThemeProvider>

    </DataContext.Provider>
}

export { DataContext, DataProvider };