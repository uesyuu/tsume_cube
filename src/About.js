import React, {useEffect} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import {useTranslation} from "react-i18next";
import {AppBar, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: enJson},
        ja: {translation: jaJson}
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {escapeValue: false}
})

const About = (props) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        link: {
            margin: '20px 0'
        }
    }))
    const classes = useStyles()

    const [t, i18n] = useTranslation()

    useEffect(() => {
        if (localStorage.lang) {
            i18n.changeLanguage(localStorage.lang)
        } else {
            i18n.changeLanguage('ja')
        }
    }, [i18n])

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>{t('詰めキューブ')}</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"}>
                    <Button variant='contained' onClick={() => props.history.push('/')}>
                        {t('戻る')}
                    </Button>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant='h3'>{t('遊び方')}</Typography>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Typography variant='body1'>
                        {t('詰めキューブとは、あと数手で解けるスクランブルを最少の手数で解くスピード競技です')}
                        <br/><br/>
                        {t('ホーム画面でスタートボタンを押すとゲームが開始します')}
                        <br/><br/>
                        {t('スクランブルが表示されるのでその最短解法を探し出して入力し、回答ボタンを押してください')}
                        <br/><br/>
                        {t('正解するとかかった時間が記録され、記録一覧画面で見ることができます')}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default About