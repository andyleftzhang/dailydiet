// pages/blog-comment/blog-comment.js
var datefns = require('date-fns')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogId: '',
        blog: {},
        commentList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            blogId: options.id
        })
        this._getBlogDetail()
    },

    _getBlogDetail() {
        wx.showLoading({
            title: '加载中'
        })
        wx.cloud.callFunction({
            name: 'blog',
            data: {
                $url: 'detail',
                blogId: this.data.blogId
            }
        }).then((res) => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            console.log(res.result)
            let commentList = res.result.commentList.data
            for (let i = 0; i < commentList.length; i++) {
                commentList[i].createTime = datefns.format(new Date(commentList[i].createTime),'yyyy-MM-dd HH:mm:ss')
            }

            this.setData({
                blog: res.result.detail,
                commentList: commentList
            })
        })
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
        this._getBlogDetail()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (event) {
        let blogObj = event.target.dataset.blog
        console.log(blogObj)
        return {
            title: blogObj.content,
            path: `/pages/blog-comment/blog-comment?id=${blogObj._id}`,
        }
    }
})
