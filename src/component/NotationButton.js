import React from "react";
import {Button, makeStyles} from "@material-ui/core";

const NotationButton = (props) => {
    const useStyles = makeStyles((theme) => ({
        content: {
            margin: theme.spacing(1),
            height: '30px'
        }
    }))
    const classes = useStyles()

    return (
        <Button
            className={classes.content}
            onClick={props.onClick}
            variant={"contained"}
            color={"default"}
        >{props.children}</Button>
    )
}

export default NotationButton