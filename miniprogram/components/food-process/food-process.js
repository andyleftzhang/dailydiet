// components/food-process/food-process.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
        tanshui: 0,
        danbai: 0,
        youzhi: 0,
        target: {},
        current: {},
        process: {},
        processTig: {},
        tizhongShow: false,
        tizhong: 150
    },

    attached() {
        this.getData();
    },

    /**
     * 组件的方法列表
     */
    methods: {

        getData() {

            let target = {}
            let tar = wx.getStorageSync('target')
            if (tar === null || tar === '') {
                target = {
                    tanshui: 150,
                    danbai: 150,
                    youzhi: 38,
                }
            } else {
                target = tar
            }

            let current = {}
            let cur = wx.getStorageSync('current')
            console.log(cur)
            if (cur === null || cur === '') {
                current = {
                    tanshui: 0,
                    danbai: 0,
                    youzhi: 0
                }
            } else {
                current = cur
            }
            let process = {
                tanshui: Math.floor(current.tanshui * 100 / target.tanshui) > 100 ? 100 : Math.floor(current.tanshui * 100 / target.tanshui),
                danbai: Math.floor(current.danbai * 100 / target.danbai) > 100 ? 100 : Math.floor(current.danbai * 100 / target.danbai),
                youzhi: Math.floor(current.youzhi * 100 / target.youzhi) > 100 ? 100 : Math.floor(current.youzhi * 100 / target.youzhi)
            }

            let processTip = {
                tanshui: current.tanshui + 'g',
                danbai: current.danbai + 'g',
                youzhi: current.youzhi + 'g',
            }

            this.setData({
                target,
                current,
                process,
                processTip
            })
        },
        addFood(event) {
            this.setData({
                'show': true
            })
        },


        onConfirm(event) {
            let tanshui = parseFloat(this.data.tanshui)
            let danbai = parseFloat(this.data.danbai)
            let youzhi = parseFloat(this.data.youzhi)
            if (isNaN(tanshui)){
                tanshui = 0;
            }
            if (isNaN(danbai)){
                danbai = 0;
            }
            if (isNaN(youzhi)){
                youzhi = 0;
            }
            let newCurrent = {
                tanshui: this.data.current.tanshui + tanshui,
                danbai: this.data.current.danbai + danbai,
                youzhi: this.data.current.youzhi + youzhi,
            }

            this.setData({
                current: newCurrent,
                tanshui: 0,
                danbai: 0,
                youzhi: 0
            })
            wx.setStorageSync('current', newCurrent)
            this.getData()
        },

        modifyTarget(event) {
            this.setData({
                tizhongShow: true
            })
        },

        onConfirmTarget(event) {
            let weight = parseFloat(this.data.tizhong)
            let target = {
                tanshui: weight,
                danbai: weight,
                youzhi: Math.floor(weight / 4)
            }

            this.setData(
                {
                    target,
                    tizhong: weight
                }
            )
            wx.setStorageSync('target', target)
            this.getData()
        },

        clearStorage() {
            wx.clearStorageSync()
            this.getData()
        }

    }
})
