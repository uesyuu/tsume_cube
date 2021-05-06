import React, {useEffect, useState} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import {useTranslation} from "react-i18next";
import {
    AppBar,
    Button,
    makeStyles,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow, Tabs,
    Toolbar,
    Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Table from '@material-ui/core/Table';
import Tab from '@material-ui/core/Tab';
import timeLib from './lib/time'

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: enJson},
        ja: {translation: jaJson}
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {escapeValue: false}
})

const Results = (props) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        tab: {
            minWidth: '60px'
        }
    }))
    const classes = useStyles()

    const [t, i18n] = useTranslation()
    const [ storageData, setStorageData ] = useState({
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': []
    })
    const [ storageDataWithVirtual, setStorageDataWithVirtual ] = useState({
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': []
    })
    const [ tabValue, setTabValue] = useState(0)
    const [ subTabValue, setSubTabValue] = useState(0)

    useEffect(() => {
        if (localStorage.lang) {
            i18n.changeLanguage(localStorage.lang)
        } else {
            i18n.changeLanguage('ja')
        }
    }, [i18n])

    useEffect(() => {
        if(localStorage.storageData) {
            const data = JSON.parse(localStorage.storageData)
            if (data['4'] && data['8']) {
                setStorageData(data)
            } else {
                setStorageData({
                    '4': [],
                    '5': data['5'],
                    '6': data['6'],
                    '7': data['7'],
                    '8': []
                })
            }
        }
        if (localStorage.storageDataWithVirtual) {
            const data = JSON.parse(localStorage.storageDataWithVirtual)
            setStorageDataWithVirtual(data)
        }
    }, [])

    const handleTabChanged = (event, newValue) => {
        setTabValue(newValue)
        console.log('TabValue: ', newValue)
    }

    const handleSubTabChanged = (event, newValue) => {
        setSubTabValue(newValue)
    }

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
                    <Typography variant='h3'>{t('記録')}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Tabs value={tabValue} onChange={handleTabChanged} centered>
                        <Tab className={classes.tab} label={t('通常')} />
                        <Tab className={classes.tab} label={t('バーチャル')} />
                    </Tabs>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <div hidden={tabValue !== 0}>
                        <Tabs value={subTabValue} onChange={handleSubTabChanged} centered>
                            <Tab className={classes.tab} label={'4' + t('手')} />
                            <Tab className={classes.tab} label={'5' + t('手')} />
                            <Tab className={classes.tab} label={'6' + t('手')} />
                            <Tab className={classes.tab} label={'7' + t('手')} />
                            <Tab className={classes.tab} label={'8' + t('手')} />
                        </Tabs>
                    </div>
                    <div hidden={tabValue !== 1}>
                        <Tabs value={subTabValue} onChange={handleSubTabChanged} centered>
                            <Tab className={classes.tab} label={'4' + t('手')} />
                            <Tab className={classes.tab} label={'5' + t('手')} />
                            <Tab className={classes.tab} label={'6' + t('手')} />
                            <Tab className={classes.tab} label={'7' + t('手')} />
                            <Tab className={classes.tab} label={'8' + t('手')} />
                        </Tabs>
                    </div>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <div hidden={tabValue !== 0}>
                        <TabPanel value={subTabValue} index={0} storageData={storageData['4']} t={t} />
                        <TabPanel value={subTabValue} index={1} storageData={storageData['5']} t={t} />
                        <TabPanel value={subTabValue} index={2} storageData={storageData['6']} t={t} />
                        <TabPanel value={subTabValue} index={3} storageData={storageData['7']} t={t} />
                        <TabPanel value={subTabValue} index={4} storageData={storageData['8']} t={t} />
                    </div>
                    <div hidden={tabValue !== 1}>
                        <TabPanel value={subTabValue} index={0} storageData={storageDataWithVirtual['4']} t={t} />
                        <TabPanel value={subTabValue} index={1} storageData={storageDataWithVirtual['5']} t={t} />
                        <TabPanel value={subTabValue} index={2} storageData={storageDataWithVirtual['6']} t={t} />
                        <TabPanel value={subTabValue} index={3} storageData={storageDataWithVirtual['7']} t={t} />
                        <TabPanel value={subTabValue} index={4} storageData={storageDataWithVirtual['8']} t={t} />
                    </div>
                </Box>
            </Box>
        </div>
    )
}

const TabPanel = (props) => {
    const useStyles = makeStyles((theme) => ({
        table: {
            width: '300px'
        }
    }))
    const classes = useStyles()

    return (
        <div hidden={props.value !== props.index}>
            <TableContainer className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>{props.t('ランク')}</TableCell>
                            <TableCell align='center'>{props.t('タイム(秒)')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.storageData
                            .sort((a, b) => a - b)
                            .slice(0, 10)
                            .map((item, index) =>
                                <TableRow key={index}>
                                    <TableCell align='center'>{index + 1}{props.t('位')}</TableCell>
                                    <TableCell align='center'>{timeLib.format(item)}</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Results