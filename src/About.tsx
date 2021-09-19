import React, {useEffect} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import {useTranslation} from "react-i18next";
import {AppBar, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {RouteComponentProps} from "react-router-dom";

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: enJson},
        ja: {translation: jaJson}
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {escapeValue: false}
}).then()

const About: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    const useStyles = makeStyles(() => ({
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
            i18n.changeLanguage(localStorage.lang).then()
        } else {
            i18n.changeLanguage('ja').then()
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
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Typography variant='h5'>{t('用語')}</Typography>
                </Box>
                <Box className={classes.link} display={"flex"}>
                    <Typography variant='h6' align='left'>{t('回転記号')}</Typography>
                </Box>
                <Box className={classes.link} display={"flex"}>
                    <Typography variant='body1'>
                        {t('ルービックキューブの回転を記号で表したものです。')}<br/>
                        {t('詰めキューブの場合キューブが固定されているので、回す面の色と記号が一致しています')}<br/>
                        <ul>
                            <li>{t('U = 上面(白), D = 下面(黄), R = 右面(赤), L = 左面(橙), F = 前面(緑), B = 後面(青)')}</li>
                            <li>{t('Uは上面を時計回りに90度回すこと')}</li>
                            <li>{t('U\'は上面を反時計回りに90度回すこと')}</li>
                            <li>{t('U2は上面を180度回すこと')}</li>
                        </ul>
                        {t('を意味します。')}
                        {t('詰めキューブの回答はこの記号に沿って答えてください。')}<br/>
                        {t('参考')}: <a href={t('回転記号の説明用URL')}>{t('回転記号の説明用ページタイトル')}</a>
                    </Typography>
                </Box>
                <Box className={classes.link} display={"flex"}>
                    <Typography variant='h6' align='left'>{t('スクランブル')}</Typography>
                </Box>
                <Box className={classes.link} display={"flex"}>
                    <Typography variant='body1'>
                        {t('回転記号の羅列によって表された、ルービックキューブの状態です。')}<br/>
                        <br/>
                        {t('スクランブルの回転記号通りにキューブを回すと、問題の状態がお手元のキューブで再現できます。')}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default About