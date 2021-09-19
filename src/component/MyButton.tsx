import React, {MouseEventHandler} from "react";
import {Button, makeStyles, PropTypes} from "@material-ui/core";

interface MyButtonProps {
    width: string,
    color: PropTypes.Color,
    onClick: MouseEventHandler<HTMLButtonElement>,
    children: string
}

const MyButton: React.FC<MyButtonProps> = (props: MyButtonProps) => {
    const useStyles = makeStyles((theme) => ({
        content: {
            margin: theme.spacing(1),
            width: props.width,
            height: '30px'
        }
    }))
    const classes = useStyles()

    return (
        <Button
            className={classes.content}
            onClick={props.onClick}
            variant={"contained"}
            color={props.color}
        >{props.children}</Button>
    )
}

export default MyButton