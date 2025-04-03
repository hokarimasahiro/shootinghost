function responsProc () {
    if (receivedCommand[1].charAt(0) == "H") {
        point += 1
        watchfont.showNumber2(point)
    }
}
input.onButtonPressed(Button.A, function () {
    if (targetList.length >= 0) {
        mode = 1
        radio.setGroup(radioGroup)
        serial.writeLine("start")
        watchfont.showNumber2(0)
    }
})
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
    watchfont.showNumber2(radioGroup)
})
function CQreceiveProc () {
    radio.sendString("" + receivedCommand[1] + "," + control.deviceName() + "," + convertToText(radioGroup))
    if (targetList.indexOf(receivedCommand[1]) == -1) {
        targetList.push(receivedCommand[1])
        serial.writeLine("target add " + receivedCommand[1])
    }
}
let sendStrings = ""
let point = 0
let receivedCommand: string[] = []
let radioGroup = 0
let targetList: string[] = []
let mode = 0
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
mode = 0
let waitTime = 3000
let dataValidTime = 5
targetList = []
radioGroup = Math.abs(control.deviceSerialNumber()) % 98 + 1
radio.setTransmitPower(7)
resetProc()
radio.setGroup(0)
watchfont.showNumber2(radioGroup)
basic.forever(function () {
    if (mode != 0) {
        sendStrings = "" + targetList._pickRandom() + "," + "S" + "," + convertToText(waitTime) + "," + convertToText(dataValidTime)
        radio.sendString(sendStrings)
        serial.writeLine(sendStrings)
        basic.pause(waitTime)
    }
    basic.pause(waitTime)
})
