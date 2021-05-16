import React, {useEffect, useRef, useState} from "react";
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import {useTranslation} from "react-i18next";
import min2phase from './lib/min2phase';
import moment from "moment";
import scrambleLib from './lib/scramble'
import timeLib from './lib/time'
import inverse from './lib/inverse'
import twophase from './lib/twophase'
import {TwitterShareButton} from 'react-share';
import {TwistyPlayer} from "cubing/twisty";
import {
    AppBar,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles, Toolbar,
    Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MyButton from "./component/MyButton";
import NotationButton from "./component/NotationButton";
import ErrorDisplay from "./component/ErrorDisplay";

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: enJson},
        ja: {translation: jaJson}
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {escapeValue: false}
})

function GameWithVirtual(props) {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '0 auto',
            padding: '20px',
            maxWidth: '500px'
        },
        inputContent: {
            backgroundColor: "lightgray"
        },
        display: {
            margin: '15px 0'
        },
        errorDisplay: {
            margin: '10px 0',
            height: '20px'
        }
    }))
    const classes = useStyles()
    const notationList = [
        ["U", "U'", "U2"],
        ["D", "D'", "D2"],
        ["R", "R'", "R2"],
        ["L", "L'", "L2"],
        ["F", "F'", "F2"],
        ["B", "B'", "B2"]
    ]
    const moveCount = props.location.state ? Number(props.location.state.moveCount) : 5

    const intervalRef = useRef(null);
    const [time, setTime] = useState(0);
    const [realTime, setRealTime] = useState(0);
    const [startDateTime, setStartDateTime] = useState(0);
    const [shortScramble, setShortScramble] = useState('');
    const [scramble, setScramble] = useState('');
    const [mySolution, setMySolution] = useState([]);
    const [mySolutionStr, setMySolutionStr] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [incorrectMessage, setIncorrectMessage] = useState(null)
    const [storageData, setStorageData] = useState({
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': []
    })
    const [giveUp, setGiveUp] = useState(false)
    const [openScramble, setOpenScramble] = useState(false)

    const [t, i18n] = useTranslation()

    useEffect(() => {
        if (localStorage.lang) {
            i18n.changeLanguage(localStorage.lang)
        } else {
            i18n.changeLanguage('ja')
        }
    }, [i18n])

    useEffect(() => {
        if (localStorage.storageDataWithVirtual) {
            const data = JSON.parse(localStorage.storageDataWithVirtual)
            if (!data['2'] || !data['3']) {
                setStorageData({
                    '2': [],
                    '3': [],
                    '4': data['4'],
                    '5': data['5'],
                    '6': data['6'],
                    '7': data['7'],
                    '8': data['8']
                })
            } else {
                setStorageData(data)
            }
        }
        startGame()
        return () => {
            stopTimer()
        }
    }, [])

    const makeScramble = () => {
        twophase.initialize()
        let shortScramble = ''
        let redundantScramble = ''
        while (redundantScramble.split(' ').length < 19) {
            shortScramble = scrambleLib.makeShortScramble(moveCount);
            redundantScramble = inverse.inverse(twophase.solve(shortScramble))
        }
        setShortScramble(shortScramble)
        setScramble(redundantScramble);
    };

    const startGame = () => {
        setTime(0)
        setRealTime(0)
        setStartDateTime(0)
        setMySolution([])
        setMySolutionStr('')
        setIsCorrect(false)
        setGiveUp(false)
        makeScramble();
        startTimer()
    }

    const startTimer = () => {
        if (intervalRef.current !== null) return;
        setStartDateTime(new Date().getTime())
        intervalRef.current = setInterval(() => {
            setTime(c => c + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const addMove = (move) => {
        const tmpSolution = mySolution;
        tmpSolution.push(move);
        setMySolution(tmpSolution);
        setMySolutionStr(solutionListToString(tmpSolution))
        judgeSolution(tmpSolution, solutionListToString(tmpSolution))
    };

    const removeMove = () => {
        const tmpSolution = mySolution;
        if (tmpSolution.length !== 0) {
            tmpSolution.pop();
        }
        setMySolution(tmpSolution);
        setMySolutionStr(solutionListToString(tmpSolution))
    };

    const judgeSolution = (mySolution, mySolutionStr) => {
        if (min2phase.solve(min2phase.fromScramble(inverse.inverse(shortScramble)))
            === min2phase.solve(min2phase.fromScramble(mySolutionStr))) {
            if (mySolution.length !== moveCount) {
                setIncorrectMessage(t('手数が違います!'))
                setTimeout(() => {
                    setIncorrectMessage(null)
                }, 3000)
            } else {
                stopTimer();
                const realTimeTmp = (new Date().getTime() - startDateTime) / 1000
                const storageDataTmp = {...storageData}
                storageDataTmp[moveCount.toString()].push(realTimeTmp)
                localStorage.setItem('storageDataWithVirtual', JSON.stringify(storageDataTmp))
                setIsCorrect(true);
                setRealTime(realTimeTmp)
                setStorageData(storageDataTmp)
            }
        }

    };

    const solutionListToString = (solutionList) => {
        let tmpSolutionStr = "";
        solutionList.forEach((value) => {
            tmpSolutionStr += value + " ";
        });
        return tmpSolutionStr;
    }

    const giveUpGame = () => {
        stopTimer()
        setGiveUp(true)
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>{t('詰めキューブ')}</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Button variant='contained' onClick={() => props.history.push('/')}>
                        {t('戻る')}
                    </Button>
                    <Typography variant='h5'>{moment(time * 1000).format('mm:ss')}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <Typography>{moveCount}{t('手スクランブル')}</Typography>
                    <MyButton color='default' onClick={() => setOpenScramble(true)}>{t('スクランブル表示')}</MyButton>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <twisty-player
                        puzzle="3x3x3"
                        alg={inverse.inverse(scramble + ' ' + mySolutionStr)}
                        experimental-setup-anchor="end"
                        hint-facelets="none"
                        back-view="none"
                        background="none"
                        control-panel="none"
                    />
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <MyButton color='primary' width='200px' onClick={giveUpGame}>{t('降参して答えを見る')}</MyButton>
                </Box>
                {/*<Box display={"flex"} justifyContent={"center"}>*/}
                {/*    <Typography>Correct solution is {inverse.inverse(shortScramble)}</Typography>*/}
                {/*</Box>*/}
                <Box display={"flex"} justifyContent={"center"} className={classes.inputContent}>
                    <Typography>{t('自分の回答')}: {mySolutionStr}</Typography>
                </Box>
                <Box className={classes.errorDisplay} display={"flex"} justifyContent={"center"}>
                    <ErrorDisplay message={incorrectMessage}/>&nbsp;
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <MyButton color='primary' width='120px' onClick={removeMove}>{t('1文字削除')}</MyButton>
                </Box>
                {notationList.map((oneNotationList, i) =>
                    <Box display={"flex"} justifyContent={"center"} key={i + 1}>
                        {oneNotationList.map((notation, j) =>
                            <NotationButton onClick={() => addMove(notation)} key={(i + 1) * 10 + j}>
                                {notation}
                            </NotationButton>
                        )}
                    </Box>
                )}
            </Box>
            <Dialog open={isCorrect}>
                <DialogTitle>{t('正解!')}</DialogTitle>
                <DialogContent>
                    <DialogContentText align={"center"}>
                        {t('お見事!')}<br/>
                        {t('かかった時間')}: {timeLib.format(realTime)}<br/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary'>
                        <TwitterShareButton
                            url={t('I solved a')
                            + moveCount
                            + t('手のバーチャル詰めキューブを')
                            + timeLib.format(realTime)
                            + t('で解きました！')
                            + '\n'
                            + t('解いた問題')
                            + ': '
                            + scramble
                            + '\nhttps://uesyuu.github.io/tsume_cube/ #詰めキューブ'}>
                            <Typography variant='body2'>{t('Twitterでシェア')}</Typography>
                        </TwitterShareButton>
                    </Button>
                    <Button variant='contained' color='primary' onClick={startGame}>
                        <Typography variant='body2'>{t('もう一度')}</Typography>
                    </Button>
                    <Button variant='contained' color='primary' onClick={() => props.history.push('/')}>
                        <Typography variant='body2'>{t('ホームに戻る')}</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={giveUp}>
                <DialogTitle>{t('残念!')}</DialogTitle>
                <DialogContent>
                    <DialogContentText align='center'>
                        {t('スクランブル')}:<br/>
                        {scramble}<br/>
                        {t('解法')}: {inverse.inverse(shortScramble)}<br/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={startGame}>
                        <Typography variant='body2'>{t('もう一度')}</Typography>
                    </Button>
                    <Button variant='contained' color='primary' onClick={() => props.history.push('/')}>
                        <Typography variant='body2'>{t('ホームに戻る')}</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openScramble} onClose={() => setOpenScramble(false)}>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant='body1'>
                            {t('スクランブル')}:
                            <br/>
                            {scramble}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default GameWithVirtual;
