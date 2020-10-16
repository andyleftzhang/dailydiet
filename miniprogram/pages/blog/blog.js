const PAGE_COUNT = 10;
let keyword = ''
const db = wx.cloud.database()
const userCollec = db.collection('user')
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
                subname: '7:00~9:00'
            },
            {
                name: '加餐',
                subname: '10:00~11:00',
                color: '#ee0a24'
            },
            {
                name: '午餐',
                subname: '11:30~13:30'
            },
            {
                name: '加餐',
                subname: '14:00~16:00',
                color: '#ee0a24'
            },
            {
                name: '晚餐',
                subname: '17:30~19:00'
            },
            {
                name: '夜宵',
                subname: '20:00~21:00',
                color: '#ee0a24'
            },
        ],
        userInfo: {},
        userid: '',
        adminid: 'ozVWo5ATjPKhwHYMB2I5DhFQjXB0'
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
        console.log(event.detail)
        // const detail = event.detail
        this.setData({
            show: true,
            userInfo: event.detail
        })

        //更新用户数据
        this.updateUserInfo()
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
            success: res => {
                console.log("success")
                if (res.confirm) {
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

    onLike(event) {
        console.log(event.target.dataset.blog)
        const blog = event.target.dataset.blog
        wx.cloud.callFunction({
            name: 'blog',
            data: {
                $url: 'zan',
                id: blog._id
            }
        }).then(res => {
            console.log(res.result)
        })
    },

    getOpenId() {
        wx.cloud.callFunction({
            name: 'login',
            data: {
                $url: 'login'
            }
        }).then((res) => {
            this.setData({
                userid: res.result.openid
            })
        })
    },

    gotoMine(event) {
        console.log(event)
        const openid = event.detail.openid
        wx.navigateTo({
            url: `../mine/mine?openid=${openid}`
        })
    },

    //更新、注册用户信息
    updateUserInfo() {
        userCollec.where({
            _id: this.data.userid
        }).count()
            .then(res => {
                //如果用户不存在，则添加
                if (res.total === 0) {
                    userCollec.add({
                        data: {
                            ...this.data.userInfo,
                            _id: this.data.userid,
                            createTime: db.serverDate()
                        }
                    }).then((res => {
                        console.log(res)
                    }))
                } else if (res.total === 1) {
                    //如果存在，则更新信息
                    try {
                        userCollec.where({
                            _id: this.data.userid
                        }).update({
                            data: {
                                ...this.data.userInfo
                            }
                        }).then(res=>{
                            console.log(res)
                        })
                    } catch (e) {
                        console.log(e)
                    }

                }

            })
    }
})
