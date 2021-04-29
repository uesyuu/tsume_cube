import React, {useState} from "react";
import {AppBar, Button, Dialog, List, ListItem, ListItemText, makeStyles, Toolbar, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const Home = (props) => {
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

    const [open, setOpen] = useState(false)
    const moveCountList = [5, 6, 7]

    return (
        <div>
            <AppBar position={"relative"}>
                <Toolbar>
                    <Typography>詰めキューブ</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} maxWidth={"xs"} display={"flex"} flexDirection={"column"}>
                <Box display={"flex"} justifyContent={"center"}>
                    <Typography variant='h3'>詰めキューブ</Typography>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button variant='contained' size='large' onClick={() => setOpen(true)}>
                        スタート
                    </Button>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button variant='contained' size='large' onClick={() => props.history.push('/about')}>
                        遊び方
                    </Button>
                </Box>
                <Box className={classes.link} display={"flex"} justifyContent={"center"}>
                    <Button variant='contained' size='large' onClick={() => props.history.push('/results')}>
                        記録
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
                                <ListItemText primary={moveCount + "手スクランブルに挑戦"}/>
                            </ListItem>
                    ))}
                </List>
            </Dialog>
        </div>
    )
}

export default Home