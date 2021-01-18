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
        joinTime: '',
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
                headerImgId: 'cloud://dev-3guxqqc6f0a3d674.6465-dev-3guxqqc6f0a3d674-1303887310/blog/1602668966405-62242.89612628182.jpg'
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
