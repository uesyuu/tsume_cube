import React, {useEffect, useRef, useState} from "react";
import min2phase from './lib/min2phase';
import moment from "moment";
import scrambleLib from './lib/scramble'
import timeLib from './lib/time'
import inverse from './lib/inverse'
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

function Game(props) {
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
    const moveCount = Number(props.location.state.moveCount)

    const intervalRef = useRef(null);
    const [time, setTime] = useState(0);
    const [realTime, setRealTime] = useState(0);
    const [startDateTime, setStartDateTime] = useState(0);
    const [shortScramble, setShortScramble] = useState('');
    const [scramble, setScramble] = useState('');
    const [mySolution, setMySolution] = useState([]);
    const [mySolutionStr, setMySolutionStr] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [ incorrectMessage, setIncorrectMessage ] = useState(null)
    const [ storageData, setStorageData ] = useState({
        '5': [],
        '6': [],
        '7': []
    })

    useEffect(() => {
        if(localStorage.storageData) {
            const data = JSON.parse(localStorage.storageData)
            setStorageData(data)
        }
        startGame()
        return () => {
            stopTimer()
        }
    }, [])

    const makeScramble = () => {
        const shortScramble = scrambleLib.makeShortScramble(moveCount);
        setShortScramble(shortScramble)
        const redundantSolution = shortScramble + " B' D' L' F' U' R' B' D' L' F' U' R'";
        const scr1 = inverse.inverse(min2phase.solve(min2phase.fromScramble(redundantSolution)));
        const scr2 = "R U F L D B R U F L D B";
        const redundantScramble = scrambleLib.makeCorrectScramble(scr1, scr2);
        setScramble(redundantScramble);
    };

    const startGame = () => {
        setTime(0)
        setRealTime(0)
        setStartDateTime(0)
        setMySolution([])
        setMySolutionStr('')
        setIsCorrect(false)
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
    };

    const removeMove = () => {
        const tmpSolution = mySolution;
        if (tmpSolution.length !== 0) {
            tmpSolution.pop();
        }
        setMySolution(tmpSolution);
        setMySolutionStr(solutionListToString(tmpSolution))
    };

    const judgeSolution = () => {
        if (min2phase.solve(min2phase.fromScramble(inverse.inverse(shortScramble)))
            === min2phase.solve(min2phase.fromScramble(mySolutionStr))) {
            stopTimer();
            const realTimeTmp  = (new Date().getTime() - startDateTime) / 1000
            const storageDataTmp = {...storageData}
            storageDataTmp[moveCount.toString()].push(realTimeTmp)
            localStorage.setItem('storageData', JSON.stringify(storageDataTmp))
            setIsCorrect(true);
            setRealTime(realTimeTmp)
            setStorageData(storageDataTmp)
        } else {
            setIncorrectMessage('不正解!')
            setTimeout(() => {
                setIncorrectMessage(null)
            }, 3000)
        }
    };

    const solutionListToString = (solutionList) => {
        let tmpSolutionStr = "";
        solutionList.forEach((value) => {
            tmpSolutionStr += value + " ";
        });
        return tmpSolutionStr;
    }

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>詰めキューブ</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Button variant='contained' onClick={() => props.history.push('/')}>
                        戻る
                    </Button>
                    <Typography variant='h5'>{moment(time * 1000).format('mm:ss')}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography>スクランブル</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography className={classes.display}>{scramble}</Typography>
                </Box>
                {/*<Box display={"flex"} justifyContent={"center"}>*/}
                {/*    <Typography>Correct solution is {inverse.inverse(shortScramble)}</Typography>*/}
                {/*</Box>*/}
                <Box display={"flex"} justifyContent={"center"} className={classes.inputContent}>
                    <Typography>自分の回答: {mySolutionStr}</Typography>
                </Box>
                <Box className={classes.errorDisplay} display={"flex"} justifyContent={"center"}>
                    <ErrorDisplay message={incorrectMessage} />&nbsp;
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <MyButton onClick={judgeSolution}>回答する</MyButton>
                    <MyButton onClick={removeMove}>1文字削除</MyButton>
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
                <DialogTitle>正解!</DialogTitle>
                <DialogContent>
                    <DialogContentText align={"center"}>
                        お見事!<br/>
                        かかった時間: {timeLib.format(realTime)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={startGame}>もう一度</Button>
                    <Button onClick={() => props.history.push('/')}>ホームに戻る</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Game;
