import React, {useEffect, useState} from "react";
import {
    AppBar,
    Button,
    makeStyles,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, Tabs,
    Toolbar,
    Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Table from '@material-ui/core/Table';
import Tab from '@material-ui/core/Tab';
import timeLib from './lib/time'

const Results = (props) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        link: {
            margin: '20px 0'
        },
        tab: {
            minWidth: '60px'
        }
    }))
    const classes = useStyles()

    const [ storageData, setStorageData ] = useState({
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': []
    })
    const [ tabValue, setTabValue] = useState(0)

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
    }, [])

    const handleTabChanged = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>詰めキューブ</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"}>
                    <Button variant='contained' onClick={() => props.history.push('/')}>
                        戻る
                    </Button>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant='h3'>記録</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Tabs value={tabValue} onChange={handleTabChanged} centered>
                        <Tab className={classes.tab} label='4手' />
                        <Tab className={classes.tab} label='5手' />
                        <Tab className={classes.tab} label='6手' />
                        <Tab className={classes.tab} label='7手' />
                        <Tab className={classes.tab} label='8手' />
                    </Tabs>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <TabPanel value={tabValue} index={0} storageData={storageData['4']} />
                    <TabPanel value={tabValue} index={1} storageData={storageData['5']} />
                    <TabPanel value={tabValue} index={2} storageData={storageData['6']} />
                    <TabPanel value={tabValue} index={3} storageData={storageData['7']} />
                    <TabPanel value={tabValue} index={4} storageData={storageData['8']} />
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
                    <TableBody>
                        {props.storageData
                            .sort((a, b) => a - b)
                            .slice(0, 10)
                            .map((item, index) =>
                                <TableRow key={index}>
                                    <TableCell align='center'>{index + 1}位</TableCell>
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