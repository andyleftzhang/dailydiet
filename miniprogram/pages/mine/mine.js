// pages/mine/mine.js
const app = getApp()
const datefns = require('date-fns')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        actions: [
            {
                name: '更换相册封面',
            },
        ],
        headerImgId: '',
        // 加入时间
        joinTime: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let headerImgId = wx.getStorageSync('headerImg')
        if (headerImgId !== '') {
            this.setData({
                headerImgId: headerImgId
            })
        } else {
            this.setData({
                headerImgId: 'data:image/jpeg;base64,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'
            })
        }

        this.getUserInfoDetail()

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onClose() {
        this.setData({show: false});
    },

    onSelect(event) {
        console.log(event.detail.name);
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: result => {
                console.log(result)
                let img = result.tempFilePaths[0]
                wx.saveFile({
                    tempFilePath: img,
                    success: res => {
                        wx.setStorage({
                            key: 'headerImg',
                            data: res.savedFilePath
                        })
                        this.setData({
                            headerImgId: res.savedFilePath
                        })
                    }
                })
            }
        })
    },

    changeHeaderImg(event) {
        console.log(event)
        this.setData({
            show: true,
        })
    },

    onGetQRCode() {
        wx.showLoading({
            title: '正在获取小程序码'
        })
        wx.cloud.callFunction({
            name: 'getQRcode'
        }).then(res => {
            wx.hideLoading()
            // console.log(res)
            wx.previewImage({
                urls: [res.result],
                current: res.result
            })
        }).catch((err) => {
            wx.hideLoading()
            wx.showToast({
                icon: 'none',
                title: '网络出现异常~'
            })
        })
    },

    getUserInfoDetail() {

        //获取用户表信息
        wx.cloud.database().collection('user').get().then(res => {
            //如果用户已存在，则使用初次加入时间
            if (res.data.length === 1) {
                // console.log(res.data[0].createTime)
                let time = res.data[0].createTime
                this.setData({
                    joinTime: datefns.format(new Date(time), 'yyyy-MM-dd')
                })
            } else {
                //如果用户不存在，则从打卡里挑个最早的作为打开时间
                wx.cloud.database().collection('blog')
                    .orderBy('createTime', 'asc')
                    .limit(1)
                    .get()
                    .then(res => {
                        // if (res.data.length >= 0){
                        //     console.log(res.data[0].createTime)
                        // }
                        //找到最新的一个blog
                        if (res.data.length === 1) {
                            let blog = res.data[0]
                            this.setData({
                                joinTime: datefns.format(new Date(blog.createTime), 'yyyy-MM-dd')
                            })
                            //添加到用户表中
                            wx.cloud.database().collection('user').add({
                                data: {
                                    _id: blog._openid,
                                    createTime: blog.createTime
                                }
                            }).then(res => {
                                console.log(res)
                            })
                            console.log(blog)

                        }
                    })
            }
        })
    }
})
