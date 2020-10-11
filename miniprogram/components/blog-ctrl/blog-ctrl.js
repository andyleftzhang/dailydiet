// components/blog-ctrl/blog-ctrl.js
var datefns = require('date-fns')

const db = wx.cloud.database()
let userInfo = {}
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blogId: String,
        blog: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        loginShow: false,
        modalShow: false, //是否显示评论框
    },

    externalClasses: [
        'iconfont',
        'icon-pinglun',
        'icon-fenxiang'
    ],

    /**
     * 组件的方法列表
     */
    methods: {
        onLoginSuccess(event) {
            userInfo = event.detail

            this.setData({
                loginShow: false
            }, () => {
                this.setData({
                    modalShow: true
                })
            })
        },

        onLoginFail() {
            wx.showModal({
                title: '授权用户才能发表评论'
            })
        },

        onComment() {
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
                        this.setData({
                            modalShow: true
                        })
                    } else {
                        this.setData({
                            loginShow: true
                        })
                    }
                }
            })
        },

        onInput(event) {
            this.setData({
                content: event.detail.value
            })
        },
        onSend(event) {
            let createTime = db.serverDate()
            let content = this.data.content
            if (content.trim() === '') {
                wx.showToast({
                    title: '评论内容不能为空',
                    icon: 'icon'
                })
                return
            }
            wx.showLoading({
                title: '评论中',
                mask: true
            })
            db.collection('blog-comment')
                .add({
                    data: {
                        content,
                        createTime: createTime,
                        blogId: this.properties.blogId,
                        nickName: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl
                    }
                }).then((res) => {

                //推送消息

                wx.hideLoading()
                wx.showToast({
                    title: '评论成功'
                })

                wx.showModal({
                    title: '需要订阅通知吗',
                    success: result => {
                        wx.requestSubscribeMessage({
                            tmplIds: ['dwJd2rlMy0TEsaa3uetKP-dB909pLB-LvGIse0mbDkw'],
                            success: (res) => {
                                wx.cloud.callFunction({
                                    name: 'sendMessage',
                                    data: {
                                        openId: userInfo.openId,
                                        blogId: this.properties.blogId,
                                        createTime: datefns.format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                                        content: content
                                    }
                                }).then((res) => {
                                    console.log(res)
                                })
                            },
                            fail: (err) => {
                                console.log(err)
                            }
                        })

                        this.setData({
                            modalShow: false,
                            content: ''
                        })
                    }
                })

                //父元素刷新评论
                this.triggerEvent('commentSuccess')
            })
        }
    }
})
