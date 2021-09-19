import React from "react";
import {TwistyPlayer} from "cubing/twisty";
import {Alg} from "cubing/alg";

interface CubePlayerProps {
    setupAlg: string
    scramble: string
    experimentalSetupAnchor: "start" | "end" | undefined
    visualization: "3D" | "2D" | "experimental-2D-LL" | "PG3D" | undefined
    controlPanel: "none" | "bottom-row" | undefined
}

const CubePlayer: React.FC<CubePlayerProps> = (props: CubePlayerProps) => {
    const container = React.useRef<TwistyPlayer | null>(null)
    React.useEffect(() => {
        if (!container.current?.firstChild) {
            const initial = new TwistyPlayer({
                puzzle: "3x3x3",
                experimentalSetupAlg: props.setupAlg,
                alg: props.scramble,
                experimentalSetupAnchor: props.experimentalSetupAnchor,
                visualization: props.visualization,
                hintFacelets: "none",
                backView: "top-right",
                background: "none",
                controlPanel: props.controlPanel
            })
            container.current?.appendChild(initial)
        } else {
            const tp = container.current?.firstChild as TwistyPlayer
            tp.alg = Alg.fromString(props.scramble)
            tp.updatePuzzleDOM(true).then()
        }
    })
    return <span ref={container} />
}

export default CubePlayer