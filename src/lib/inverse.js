const inverse = (function () {
    const faceNames = {
        0: 'U',
        1: 'R',
        2: 'F',
        3: 'D',
        4: 'L',
        5: 'B',
        6: 'E',
        7: 'M',
        8: 'S',
        9: 'x',
        10: 'y',
        11: 'z',
        12: 'u',
        13: 'r',
        14: 'f',
        15: 'd',
        16: 'l',
        17: 'b'
    };

    const faceNums = {
        U: 0,
        R: 1,
        F: 2,
        D: 3,
        L: 4,
        B: 5,
        E: 6,
        M: 7,
        S: 8,
        x: 9,
        y: 10,
        z: 11,
        u: 12,
        r: 13,
        f: 14,
        d: 15,
        l: 16,
        b: 17
    };

    const inverse = (arg) => {
        var face, k, len, move, power, result, str;
        result = (function() {
            var k, len, ref, results;
            ref = parseAlg(arg);
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
                move = ref[k];
                face = move / 3 | 0;
                power = move % 3;
                results.push(face * 3 + -(power - 1) + 1);
            }
            return results;
        })();
        result.reverse();
        if (typeof arg === 'string') {
            str = '';
            for (k = 0, len = result.length; k < len; k++) {
                move = result[k];
                face = move / 3 | 0;
                power = move % 3;
                str += faceNames[face];
                if (power === 1) {
                    str += '2';
                } else if (power === 2) {
                    str += "'";
                }
                str += ' ';
            }
            return str.substring(0, str.length - 1);
        } else if (arg.length != null) {
            return result;
        } else {
            return result[0];
        }
    }

    const parseAlg = (arg) => {
        var k, len, move, part, power, ref, results;
        if (typeof arg === 'string') {
            ref = arg.split(/\s+/);
            // String
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
                part = ref[k];
                if (part.length === 0) {
                    // First and last can be empty
                    continue;
                }
                if (part.length > 2) {
                    throw new Error(`Invalid move: ${part}`);
                }
                move = faceNums[part[0]];
                if (move === void 0) {
                    throw new Error(`Invalid move: ${part}`);
                }
                if (part.length === 1) {
                    power = 0;
                } else {
                    if (part[1] === '2') {
                        power = 1;
                    } else if (part[1] === "'") {
                        power = 2;
                    } else {
                        throw new Error(`Invalid move: ${part}`);
                    }
                }
                results.push(move * 3 + power);
            }
            return results;
        } else if (arg.length != null) {
            // Already an array
            return arg;
        } else {
            // A single move
            return [arg];
        }
    }

    return {
        inverse: inverse
    }
})();

module.exports = inverse