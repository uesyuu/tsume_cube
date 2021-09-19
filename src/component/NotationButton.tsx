import React, {MouseEventHandler} from "react";
import {Button, makeStyles} from "@material-ui/core";

interface NotationButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>,
    children: string
}

const NotationButton: React.FC<NotationButtonProps> = (props: NotationButtonProps) => {
    let backgroundColor = 'white'
    if (props.children.toString().includes('U')) {
        backgroundColor = 'white'
    } else if (props.children.toString().includes('D')) {
        backgroundColor = 'yellow'
    } else if (props.children.toString().includes('R')) {
        backgroundColor = 'red'
    } else if (props.children.toString().includes('L')) {
        backgroundColor = 'orange'
    } else if (props.children.toString().includes('F')) {
        backgroundColor = 'limegreen'
    } else if (props.children.toString().includes('B')) {
        backgroundColor = 'cornflowerblue'
    }

    const useStyles = makeStyles((theme) => ({
        content: {
            margin: theme.spacing(1),
            height: '30px',
            backgroundColor: backgroundColor,
            '&:hover': {
                backgroundColor: backgroundColor
            }
        }
    }))
    const classes = useStyles()

    return (
        <Button
            className={classes.content}
            onClick={props.onClick}
            variant='contained'
        >{props.children}</Button>
    )
}

export default NotationButton