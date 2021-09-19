import React from "react";
import {makeStyles, Typography} from "@material-ui/core";

interface ErrorDisplayProps {
    message: string | null
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = (props: ErrorDisplayProps) => {
    const useStyles = makeStyles(() => ({
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