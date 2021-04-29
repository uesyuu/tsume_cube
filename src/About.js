import React from "react";
import {AppBar, Button, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import Box from "@material-ui/core/Box";

const About = () => {
    const useStyles = makeStyles((theme) => ({
        container: {
            margin: '40px auto',
            padding: '20px',
            maxWidth: '500px'
        },
        link: {
            margin: '20px 0'
        }
    }))
    const classes = useStyles()

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>詰めキューブ</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant='h3'>遊び方</Typography>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Typography variant='body1'>
                        詰めキューブとは、あと数手で解けるスクランブルを最少の手数で解くスピード競技です<br/>
                        <br/>
                        ホーム画面でスタートボタンを押すとゲームが開始します<br/>
                        <br/>
                        スクランブルが表示されるのでその最短解法を探し出して入力し、回答ボタンを押してください<br/>
                        <br/>
                        正解するとかかった時間が記録され、記録一覧画面で見ることができます<br/>
                    </Typography>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button variant='contained' size='large'>
                        <Link to='/'>戻る</Link>
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default About