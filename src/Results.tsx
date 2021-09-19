import React, {useEffect, useState} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next, TFunction} from "react-i18next";
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

const Results: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    const useStyles = makeStyles(() => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        tab: {
            minWidth: '50px'
        }
    }))
    const classes = useStyles()

    const [t, i18n] = useTranslation()
    const [ storageData, setStorageData ] = useState([
        [],
        [],
        Array<number>(), // 2
        Array<number>(), // 3
        Array<number>(), // 4
        Array<number>(), // 5
        Array<number>(), // 6
        Array<number>(), // 7
        Array<number>(), // 8
    ])
    const [ storageDataWithVirtual, setStorageDataWithVirtual ] = useState([
        [],
        [],
        Array<number>(), // 2
        Array<number>(), // 3
        Array<number>(), // 4
        Array<number>(), // 5
        Array<number>(), // 6
        Array<number>(), // 7
        Array<number>(), // 8
    ])
    const [ storageDataWithoutCube, setStorageDataWithoutCube ] = useState([
        [],
        [],
        Array<number>(), // 2
        Array<number>(), // 3
        Array<number>(), // 4
        Array<number>(), // 5
        Array<number>(), // 6
        Array<number>(), // 7
        Array<number>(), // 8
    ])
    const [ tabValue, setTabValue] = useState(0)
    const [ subTabValue, setSubTabValue] = useState(0)

    useEffect(() => {
        if (localStorage.lang) {
            i18n.changeLanguage(localStorage.lang).then()
        } else {
            i18n.changeLanguage('ja').then()
        }
    }, [i18n])

    useEffect(() => {
        if (localStorage.storageData) {
            const data = JSON.parse(localStorage.storageData)
            if (Array.isArray(data)) {
                setStorageData(data)
            } else if (typeof data === "object") {
                if (!data['4'] || !data['8']) {
                    setStorageData([
                        [],
                        [],
                        [],
                        [],
                        [],
                        data['5'],
                        data['6'],
                        data['7'],
                        []
                    ])
                } else if (!data['2'] || !data['3']) {
                    setStorageData([
                        [],
                        [],
                        [],
                        [],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                } else {
                    setStorageData([
                        [],
                        [],
                        data['2'],
                        data['3'],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                }
            }
        }
        if (localStorage.storageDataWithVirtual) {
            const data = JSON.parse(localStorage.storageDataWithVirtual)
            if (Array.isArray(data)) {
                setStorageDataWithVirtual(data)
            } else if (typeof data === "object") {
                if (!data['2'] || !data['3']) {
                    setStorageDataWithVirtual([
                        [],
                        [],
                        [],
                        [],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                } else {
                    setStorageDataWithVirtual([
                        [],
                        [],
                        data['2'],
                        data['3'],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                }
            }
        }
        if (localStorage.storageDataWithoutCube) {
            const data = JSON.parse(localStorage.storageDataWithoutCube)
            if (Array.isArray(data)) {
                setStorageDataWithoutCube(data)
            } else if (typeof data === "object") {
                if (!data['2'] || !data['3']) {
                    setStorageDataWithoutCube([
                        [],
                        [],
                        [],
                        [],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                } else {
                    setStorageDataWithoutCube([
                        [],
                        [],
                        data['2'],
                        data['3'],
                        data['4'],
                        data['5'],
                        data['6'],
                        data['7'],
                        data['8']
                    ])
                }
            }
        }
    }, [])

    const handleTabChanged = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue)
    }

    const handleSubTabChanged = (event: React.ChangeEvent<{}>, newValue: number) => {
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
                        <Tab className={classes.tab} label={t('画像のみ')} />
                    </Tabs>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <div>
                        <Tabs value={subTabValue} onChange={handleSubTabChanged} centered>
                            <Tab className={classes.tab} label='2' />
                            <Tab className={classes.tab} label='3' />
                            <Tab className={classes.tab} label='4' />
                            <Tab className={classes.tab} label='5' />
                            <Tab className={classes.tab} label='6' />
                            <Tab className={classes.tab} label='7' />
                            <Tab className={classes.tab} label='8' />
                        </Tabs>
                    </div>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <div hidden={tabValue !== 0}>
                        <TabPanel value={subTabValue} index={0} storageData={storageData['2']} t={t} />
                        <TabPanel value={subTabValue} index={1} storageData={storageData['3']} t={t} />
                        <TabPanel value={subTabValue} index={2} storageData={storageData['4']} t={t} />
                        <TabPanel value={subTabValue} index={3} storageData={storageData['5']} t={t} />
                        <TabPanel value={subTabValue} index={4} storageData={storageData['6']} t={t} />
                        <TabPanel value={subTabValue} index={5} storageData={storageData['7']} t={t} />
                        <TabPanel value={subTabValue} index={6} storageData={storageData['8']} t={t} />
                    </div>
                    <div hidden={tabValue !== 1}>
                        <TabPanel value={subTabValue} index={0} storageData={storageDataWithVirtual['2']} t={t} />
                        <TabPanel value={subTabValue} index={1} storageData={storageDataWithVirtual['3']} t={t} />
                        <TabPanel value={subTabValue} index={2} storageData={storageDataWithVirtual['4']} t={t} />
                        <TabPanel value={subTabValue} index={3} storageData={storageDataWithVirtual['5']} t={t} />
                        <TabPanel value={subTabValue} index={4} storageData={storageDataWithVirtual['6']} t={t} />
                        <TabPanel value={subTabValue} index={5} storageData={storageDataWithVirtual['7']} t={t} />
                        <TabPanel value={subTabValue} index={6} storageData={storageDataWithVirtual['8']} t={t} />
                    </div>
                    <div hidden={tabValue !== 2}>
                        <TabPanel value={subTabValue} index={0} storageData={storageDataWithoutCube['2']} t={t} />
                        <TabPanel value={subTabValue} index={1} storageData={storageDataWithoutCube['3']} t={t} />
                        <TabPanel value={subTabValue} index={2} storageData={storageDataWithoutCube['4']} t={t} />
                        <TabPanel value={subTabValue} index={3} storageData={storageDataWithoutCube['5']} t={t} />
                        <TabPanel value={subTabValue} index={4} storageData={storageDataWithoutCube['6']} t={t} />
                        <TabPanel value={subTabValue} index={5} storageData={storageDataWithoutCube['7']} t={t} />
                        <TabPanel value={subTabValue} index={6} storageData={storageDataWithoutCube['8']} t={t} />
                    </div>
                </Box>
            </Box>
        </div>
    )
}

interface TabPanelProps {
    value: number,
    index: number,
    storageData: Array<number>,
    t: TFunction<"translation">
}

const TabPanel = (props: TabPanelProps) => {
    const useStyles = makeStyles(() => ({
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