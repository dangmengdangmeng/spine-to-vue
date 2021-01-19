export default class Helper {
    static toHump(name) {
        return name.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
    }

    static toLine(name) {
        return name.replace(/([A-Z])/g, "_$1").toLowerCase()
    }

    static optionsToForm(options) {
        let params = {}
        let properties = Object.getOwnPropertyNames(options)
        properties.forEach(property => {
            let value = options[property]
            if (value != null) {
                if (typeof value === 'boolean') {
                    params[Helper.toLine(property)] = value ? 1 : 0
                } else {
                    params[Helper.toLine(property)] = value
                }
            }
        })
        return params
    }


    static inApp() {
        let agent = window.navigator.userAgent.toLowerCase()
        return agent.includes('iyuyi')
    }

    static filterWeekday(val) {
        switch (val) {
            case 0:
                return '周日'
            case 1:
                return '周一'
            case 2:
                return '周二'
            case 3:
                return '周三'
            case 4:
                return '周四'
            case 5:
                return '周五'
            case 6:
                return '周六'
        }
    }

    //计算数组中最小的值
    static getMinValue(items) {
        let min = items[0] ? items[0][0] : null
        items.map(item => {
            let curVal = item[0]
            if (curVal) {
                min = curVal < min ? curVal : min
            }
        })
        return min
    }

    //计算数组中最大的值
    static getMaxValue(items) {
        let max = items[0] ? items[0][1] : null
        items.map(item => {
            let curVal = item[1]
            if (curVal) {
                max = curVal > max ? curVal : max
            }
        })
        return max
    }

    static parseJson(json) {
        return (new Function("return " + json))()
    }

    static getMobileRatio() {
        const baseSize = {width: 667, height: 375},//基础屏幕尺寸
            curSize = {width: window.innerWidth, height: window.innerHeight},//当前屏幕尺寸
            widthRatio = curSize.width / baseSize.width,
            heightRatio = curSize.height / baseSize.height
        return {widthRatio, heightRatio}
    }
}
