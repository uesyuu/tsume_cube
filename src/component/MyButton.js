import React from "react";
import {Button, makeStyles} from "@material-ui/core";

const MyButton = (props) => {
    const useStyles = makeStyles((theme) => ({
        content: {
            margin: theme.spacing(1),
            width: '120px',
            height: '30px'
        }
    }))
    const classes = useStyles()

    return (
        <Button
            className={classes.content}
            onClick={props.onClick}
            variant={"contained"}
            color={"primary"}
        >{props.children}</Button>
    )
}

export default MyButton