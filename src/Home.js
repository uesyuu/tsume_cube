import React, {useEffect, useState} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import {useTranslation} from "react-i18next";
import {
    AppBar,
    Button,
    Dialog,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Toolbar,
    Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box"
import twophase from './lib/twophase'

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: enJson},
        ja: {translation: jaJson}
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {escapeValue: false}
})

const Home = (props) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        link: {
            margin: '20px 0'
        },
        changeLangButton: {
            marginBottom: '10px'
        },
        button: {
            width: '160px'
        }
    }))
    const classes = useStyles()

    const [t, i18n] = useTranslation()
    const [open, setOpen] = useState(false)
    const [lang, setLang] = useState('ja')
    const moveCountList = [4, 5, 6, 7, 8]

    useEffect(() => {
        twophase.initialize()
    }, [])

    useEffect(() => {
        if (localStorage.lang) {
            setLang(localStorage.lang)
            i18n.changeLanguage(localStorage.lang)
        } else {
            i18n.changeLanguage(lang)
        }
    }, [lang, i18n])

    const handleLanguageChange = () => {
        const langTmp = lang === 'en' ? 'ja' : 'en'
        setLang(langTmp)
        localStorage.setItem('lang', langTmp)
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>{t('詰めキューブ')}</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box className={classes.changeLangButton} display='flex' justifyContent='flex-end'>
                    <Button
                        variant='outlined'
                        color='default'
                        onClick={handleLanguageChange}
                    >{t('言語変更')}</Button>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant='h3' align='center'>{t('詰めキューブ')}</Typography>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button className={classes.button} variant='contained' size='large' onClick={() => setOpen(true)}>
                        {t('スタート')}
                    </Button>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button className={classes.button} variant='contained' size='large' onClick={() => props.history.push('/about')}>
                        {t('遊び方')}
                    </Button>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button className={classes.button} variant='contained' size='large' onClick={() => props.history.push('/results')}>
                        {t('記録')}
                    </Button>
                </Box>
            </Box>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <List>
                    {moveCountList.map((moveCount =>
                            <ListItem button key={moveCount}
                                      onClick={() => props.history.push({
                                          pathname: 'game',
                                          state: {
                                              moveCount: moveCount
                                          }
                                      })}>
                                <ListItemText primary={t('Challenge') + moveCount + t('手スクランブルに挑戦')}/>
                            </ListItem>
                    ))}
                </List>
            </Dialog>
        </div>
    )
}

export default Home