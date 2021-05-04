import React from "react";
import {TwistyPlayer} from "cubing/twisty";

const ScrambleImage = ({scramble}) => {
    const container = React.useRef(null)
    React.useEffect(() => {
        if (!container.current.firstChild) {
            const initial = new TwistyPlayer({
                puzzle: "3x3x3",
                alg: scramble,
                visualization: "2D",
                hintFacelets: "none",
                backView: "top-right",
                background: "none",
                controlPanel: "none"
            })
            container.current?.appendChild(initial)
        } else {
            const tp = container.current.firstChild
            tp.alg = scramble
            tp.updatePuzzleDOM(true)
        }
    })
    return <span ref={container} />
}

export default ScrambleImage