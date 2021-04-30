const scrambleLib = (function () {
    const makeShortScramble = (len) => {
        const faceList = ["U", "R", "F", "D", "L", "B"];
        const turnList = ["", "'", "2"];
        const scrambleList = [];
        while (scrambleList.length < len) {
            const face = faceList[Math.floor(Math.random() * faceList.length)];
            const turn = turnList[Math.floor(Math.random() * turnList.length)];
            if (scrambleList.length >= 1) {
                if (face === scrambleList[scrambleList.length - 1].face) {
                    continue;
                }
            }
            if (scrambleList.length >= 2) {
                if (face === scrambleList[scrambleList.length - 2].face && (
                    (face === "U" && scrambleList[scrambleList.length - 1].face === "D") ||
                    (face === "D" && scrambleList[scrambleList.length - 1].face === "U") ||
                    (face === "R" && scrambleList[scrambleList.length - 1].face === "L") ||
                    (face === "L" && scrambleList[scrambleList.length - 1].face === "R") ||
                    (face === "F" && scrambleList[scrambleList.length - 1].face === "B") ||
                    (face === "B" && scrambleList[scrambleList.length - 1].face === "F")
                )) {
                    continue;
                }
            }
            scrambleList.push({
                face: face,
                turn: turn
            });
        }
        let scrambleText = "";
        scrambleList.forEach((value) => {
            scrambleText += value.face + value.turn + " ";
        });
        scrambleText = scrambleText.trim();
        return scrambleText;
    };

    const makeCorrectScramble = (scr1, scr2) => {
        const scr1ListTmp = scr1.split(" ");
        let scr1List = [];
        scr1ListTmp.forEach((item) => {
            const itemTmp = item.split("");
            if (itemTmp.length === 1) {
                itemTmp.push("");
            }
            scr1List.push(itemTmp);
        });
        const scr2ListTmp = scr2.split(" ");
        let scr2List = [];
        scr2ListTmp.forEach((item) => {
            const itemTmp = item.split("");
            if (itemTmp.length === 1) {
                itemTmp.push("");
            }
            scr2List.push(itemTmp);
        });
        const scr1ListRes = scr1List.slice();
        const scr2ListRes = scr2List.slice();
        let flag = true;
        let count = 0;
        while(flag) {
            if (scr1List[scr1List.length - (count + 1)][0] !== scr2List[count][0]) {
                flag = false;
            } else {
                if ((scr1List[scr1List.length - (count + 1)][1] === "" && scr2List[count][1] === "'")
                    || (scr1List[scr1List.length - (count + 1)][1] === "'" && scr2List[count][1] === "")
                    || (scr1List[scr1List.length - (count + 1)][1] === "2" && scr2List[count][1] === "2")) {
                    scr1ListRes.pop();
                    scr2ListRes.shift();
                    count++;
                } else if ((scr1List[scr1List.length - (count + 1)][1] === "'" && scr2List[count][1] === "2")
                    || (scr1List[scr1List.length - (count + 1)][1] === "2" && scr2List[count][1] === "'")) {
                    scr1ListRes[scr1ListRes.length - (count + 1)][1] = "";
                    scr2ListRes.shift();
                    flag = false;
                } else if ((scr1List[scr1List.length - (count + 1)][1] === "" && scr2List[count][1] === "2")
                    || (scr1List[scr1List.length - (count + 1)][1] === "2" && scr2List[count][1] === "")) {
                    scr1ListRes[scr1ListRes.length - (count + 1)][1] = "'";
                    scr2ListRes.shift();
                    flag = false;
                } else if ((scr1List[scr1List.length - (count + 1)][1] === "" && scr2List[count][1] === "")
                    || (scr1List[scr1List.length - (count + 1)][1] === "'" && scr2List[count][1] === "'")) {
                    scr1ListRes[scr1ListRes.length - (count + 1)][1] = "2";
                    scr2ListRes.shift();
                    flag = false;
                }
            }
        }
        const scrList = scr1ListRes.concat(scr2ListRes);
        let scrStr = "";
        scrList.forEach((item) => {
            scrStr += item[0] + item[1] + " ";
        });
        return scrStr
    };

    return {
        makeShortScramble: makeShortScramble,
        makeCorrectScramble: makeCorrectScramble
    }
})();

module.exports = scrambleLib