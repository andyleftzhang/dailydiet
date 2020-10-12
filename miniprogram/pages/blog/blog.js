const PAGE_COUNT = 10;
let keyword = ''
Page({

    /**
     * 页面的初始数据
     */
    data: {
        modalShow: false,
        blogList: [],
        show: false,
        actions: [
            {
                name: '早餐',
            },
            {
                name: '午餐',
            }, {
                name: '晚餐'
            }
        ],
        userInfo: {},
        userid:''
    },

    onPublish() {
        // this.setData({
        //     modalShow: true
        // })
        //判断用户授权信息
        wx.getSetting({
            success: (res) => {
                console.log(res)
                //获取用户信息
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (res) => {
                            console.log(res)
                            this.onLoginSuccess({
                                detail: res.userInfo
                            })
                        }
                    })
                } else {
                    this.setData({
                        modalShow: true
                    })
                }
            }
        })
    },


    onLoginSuccess(event) {
        console.log(event)
        // const detail = event.detail
        this.setData({
            show: true,
            userInfo: event.detail
        })
    },

    onLoginFail() {
        wx.showModal({
            title: '授权用户才能发布',
            content: ''
        })
    },

    goComment(event) {
        console.log(event.target.dataset.blogid)
        // wx.navigateTo({
        //     url: `../blog-comment/blog-comment?id=${event.target.dataset.blogid}`
        // })
    },

    onSearch(event) {
        console.log(event)
        keyword = event.detail.keyword;
        this.setData({
            blogList: []
        })
        this._loadBlogList()
    },

    //加载博客列表
    _loadBlogList(start = 0) {
        wx.showLoading({
            title: '拼命加载中..'
        })
        wx.cloud.callFunction({
            name: 'blog',
            data: {
                $url: 'list',
                start: start,
                count: PAGE_COUNT,
                keyword
            }
        }).then((res) => {
            console.log(res.result)
            if (start === 0) {
                this.setData({
                    blogList: res.result
                })
            } else {
                this.setData({
                    blogList: this.data.blogList.concat(res.result)
                })
            }
            wx.hideLoading()
            wx.stopPullDownRefresh()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadBlogList()
        this.getOpenId()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            blogList: []
        })
        this._loadBlogList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this._loadBlogList(this.data.blogList.length)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (event) {
        // console.log(event)
        let blogObj = event.target.dataset.blog
        console.log(blogObj)
        return {
            title: blogObj.content,
            // path: `/pages/blog-comment/blog-comment?id=${blogObj._id}`,
            path: `/pages/blog/blog`,
        }
    },

    /**
     * 删除
     * @param event
     */
    goDelete(event) {
        const blog = event.target.dataset.blog;
        console.log(blog)
        wx.showModal({
            title: '删除该饮食日常？',
            success: result => {
                console.log("success")
                wx.cloud.database()
                    .collection('blog')
                    .doc(blog._id)
                    .remove()
                    .then((res) => {
                        console.log(res)
                        this._loadBlogList()
                        wx.showToast({
                            title: '删除成功'
                        })
                    })
            }
        })
    },

    onClose() {
        this.setData({show: false});
    },

    onSelect(event) {
        console.log(event.detail.name);
        wx.navigateTo({
            url: `../blog-edit/blog-edit?nickName=${this.data.userInfo.nickName}&avatarUrl=${this.data.userInfo.avatarUrl}&blogTag=${event.detail.name}`
        })
    },

    getOpenId() {
        wx.cloud.callFunction({
            name: 'login'
        }).then((res) => {
            this.setData({
                userid: res.result.openid
            })
        })

    }
})
