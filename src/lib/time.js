const timeLib = (function () {
    const format = (time) => {
        const date = new Date(time * 1000)
        let minute = ''
        let second = ''
        let millis = ''
        if (date.getMinutes() !== 0) {
            minute = `${date.getMinutes()}:`
        }
        if (date.getMinutes() !== 0) {
            second = `${('0' + date.getSeconds()).slice(-2)}.`
        } else {
            second = `${date.getSeconds()}.`
        }
        millis = `${('00' + date.getMilliseconds()).slice(-3)}`

        return minute + second + millis
    }
    return {
        format: format
    }
})();

module.exports = timeLib