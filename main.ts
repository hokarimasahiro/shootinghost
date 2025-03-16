function respons処理 () {
    if (受信文字[2] == "HIT") {
        point += 1
        watchfont.showNumber2(point)
    }
}
input.onButtonPressed(Button.A, function () {
    radio.setGroup(無線グループ)
    basic.showString("start")
})
radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
    受信文字 = receivedString.split(",")
    if (受信文字[0] == "CQ") {
        CQ受信処理()
    } else if (受信文字[0] == control.deviceName()) {
        respons処理()
    }
})
function CQ受信処理 () {
    radio.sendString("" + 受信文字[1] + "," + control.deviceName() + "," + convertToText(無線グループ))
    targetValid = 0
    for (let target of targetList) {
        if (target == 受信文字[1]) {
            targetValid = 1
        }
    }
    if (targetValid == 0) {
        targetList.push(受信文字[1])
        serial.writeLine("target add " + 受信文字[1])
    }
}
let targetValid = 0
let point = 0
let 受信文字: string[] = []
let 無線グループ = 0
let targetList: string[] = []
serial.redirectToUSB()
serial.setTxBufferSize(128)
serial.setRxBufferSize(128)
let waitTime = 3000
let dataValidTime = 5
targetList = []
無線グループ = Math.abs(control.deviceSerialNumber()) % 98 + 1
watchfont.showNumber2(無線グループ)
radio.setTransmitPower(7)
basic.forever(function () {
    radio.sendString("" + targetList._pickRandom() + "," + "START" + "," + convertToText(waitTime) + "," + convertToText(dataValidTime))
    basic.pause(waitTime)
    basic.pause(waitTime)
})
