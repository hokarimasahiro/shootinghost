function commandSend () {
    sendStrings = "" + targetList._pickRandom() + "," + "S" + "," + convertToText(waitTime) + "," + convertToText(dataValidTime)
    radio.sendString(sendStrings)
    serial.writeLine(sendStrings)
}
function dispRestTime (restTime: number) {
    if (restTime <= 5000) {
        if (restTime >= 4000) {
            watchfont.plot(2, 0)
        }
        if (restTime >= 3000) {
            watchfont.plot(2, 1)
        }
        if (restTime >= 2000) {
            watchfont.plot(2, 2)
        }
        if (restTime >= 1000) {
            watchfont.plot(2, 3)
        }
        watchfont.plot(2, 4)
    }
}
function responsProc () {
    if (receivedCommand[1].charAt(0) == "H") {
        point += 1
        nextTime = input.runningTime() + intervalTime
    }
}
input.onButtonPressed(Button.A, function () {
    mode = 0
    if (targetList.length > 0) {
        radio.setGroup(radioGroup)
        for (let カウンター = 0; カウンター <= 3; カウンター++) {
            watchfont.showNumber2(3 - カウンター)
            basic.pause(1000)
        }
        basic.clearScreen()
        nextTime = input.runningTime()
        endTime = input.runningTime() + gameTime
        serial.writeLine("start")
        point = 0
        watchfont.showNumber2(point)
        mode = 1
    } else {
        basic.showIcon(IconNames.Confused)
        basic.pause(1000)
        watchfont.showNumber2(radioGroup)
    }
})
function initProc () {
    mode = 0
    point = 0
    targetList = []
    radio.setTransmitPower(7)
    radio.setGroup(0)
    watchfont.showNumber2(radioGroup)
}
function resetProc () {
    radio.setGroup(radioGroup)
    radio.sendString("" + control.deviceName() + "," + "RESET")
}
radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
    receivedCommand = receivedString.split(",")
    if (receivedCommand[0] == "CQ") {
        CQreceiveProc()
    } else {
        responsProc()
    }
})
input.onButtonPressed(Button.B, function () {
    resetProc()
    initProc()
})
function CQreceiveProc () {
    radio.sendString("" + receivedCommand[1] + "," + control.deviceName() + "," + convertToText(radioGroup))
    if (targetList.indexOf(receivedCommand[1]) == -1) {
        targetList.push(receivedCommand[1])
        serial.writeLine("target add " + receivedCommand[1])
    }
}
let endTime = 0
let mode = 0
let nextTime = 0
let point = 0
let receivedCommand: string[] = []
let targetList: string[] = []
let sendStrings = ""
let radioGroup = 0
let gameTime = 0
let dataValidTime = 0
let intervalTime = 0
let waitTime = 0
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
serial.writeLine("reboot")
waitTime = 3000
intervalTime = 1000
dataValidTime = 5
gameTime = 30000
radioGroup = Math.abs(control.deviceSerialNumber()) % 98 + 1
resetProc()
initProc()
basic.forever(function () {
    if (mode == 0) {
        basic.pause(100)
    } else if (mode == 2) {
        watchfont.showNumber2(point)
        basic.pause(500)
        basic.clearScreen()
        basic.pause(500)
    } else {
        watchfont.showNumber2(point)
        if (input.runningTime() - endTime >= 0) {
            mode = 2
            serial.writeLine("end")
        } else {
            dispRestTime(endTime - input.runningTime())
            if (input.runningTime() >= nextTime) {
                commandSend()
                nextTime = input.runningTime() + (waitTime + intervalTime)
            }
        }
    }
})
