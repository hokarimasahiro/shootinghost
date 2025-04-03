function responsProc () {
    if (receivedCommand[3].charAt(0) == "H") {
        point += 1
        watchfont.showNumber2(point)
    }
}
input.onButtonPressed(Button.A, function () {
    radio.setGroup(radioGroup)
    basic.showString("start")
})
radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
    receivedCommand = receivedString.split(",")
    if (receivedCommand[0] == "CQ") {
        CQreceiveProc()
    } else if (receivedCommand[0] == control.deviceName()) {
        responsProc()
    }
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
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
let waitTime = 3000
let dataValidTime = 5
targetList = []
radioGroup = Math.abs(control.deviceSerialNumber()) % 98 + 1
watchfont.showNumber2(radioGroup)
radio.setGroup(0)
radio.setTransmitPower(7)
basic.forever(function () {
    sendStrings = "" + targetList._pickRandom() + "," + "S" + "," + convertToText(waitTime) + "," + convertToText(dataValidTime)
    radio.sendString(sendStrings)
    serial.writeLine(sendStrings)
    basic.pause(waitTime)
})
