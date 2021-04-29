import React from "react";
import {makeStyles, Typography} from "@material-ui/core";

const ErrorDisplay = (props) => {
    const useStyles = makeStyles((theme) => ({
        error: {
            color: "red"
        }
    }))
    const classes = useStyles()

    if (props.message === null) {
        return null
    }

    return (
        <Typography className={classes.error}>
            {props.message}
        </Typography>
    )
}

export default ErrorDisplay