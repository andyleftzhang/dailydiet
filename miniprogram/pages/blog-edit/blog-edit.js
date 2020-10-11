// pages/blog-edit/blog-edit.js
// const MAX_LENGTH = 140

const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordsNum: 0,
        MAX_LENGTH: 140,
        footerBottom: 0,
        images: [],
        MAX_IMG_NUM: 9,
        blogTag: ''
    },

    pageData: {
        userInfo: {},
        content: ''
    },

    onInput(event) {
        console.log(event.detail.value)
        this.pageData.content = event.detail.value;
        let wordsNum = event.detail.value.length
        if (wordsNum >= this.data.MAX_LENGTH) {
            wordsNum = '最大字数为' + this.data.MAX_LENGTH
        } else {
            wordsNum = `${wordsNum}/${this.data.MAX_LENGTH}`
        }
        this.setData({
            wordsNum
        })
    },

    onFocus(event) {
        // console.log(event)
        this.setData({
            footerBottom: event.detail.height
        })
    },

    onBlur() {
        this.setData({
            footerBottom: 0
        })
    },

    onChooseImage() {
        let max = this.data.MAX_IMG_NUM - this.data.images.length
        if (max > 0) {
            wx.chooseImage({
                count: max,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: result => {
                    console.log(result)
                    this.setData({
                        images: this.data.images.concat(result.tempFilePaths)
                    })
                }
            })
        }
    },

    onDeleteImg(event) {
        // console.log(event)
        let index = event.target.dataset.index
        this.data.images.splice(index, 1)
        this.setData({
            images: this.data.images
        })
    },

    onPreviewImages(event) {
        console.log(event.target.dataset.currentscr)
        wx.previewImage({
            urls: this.data.images,
            current: event.target.dataset.currentscr
        })
    },

    send() {
        //数据 -> 云数据库
        //数据库： 内容、图片fileID, openId, 昵称， 头像， 时间

        if (this.pageData.content.trim() === '') {
            wx.showToast({
                title: '请输入内容',
                icon: "none"
            })
            return
        }

        wx.showLoading({
            title: '发布中',
            mask: true  // 蒙层
        })

        // 1. 先上传每张图片
        let fileIds = []
        let promisArr = []
        this.data.images.forEach((item) => {

            let p = new Promise((resolve, reject) => {
                let sufix = /\.\w+$/.exec(item)
                wx.cloud.uploadFile({
                    cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 100000 + sufix,
                    filePath: item,
                    success: res => {
                        fileIds.push(res.fileID)
                        resolve()
                    },
                    fail: err => {
                        console.error(err)
                        reject()
                    }
                })
            })
            promisArr.push(p)
        })

        // 2. 入库
        Promise.all(promisArr).then((res) => {
            //所有图片上传成功
            console.log('上传成功')
            db.collection('blog').add({
                data: {
                    ...this.pageData.userInfo,
                    content: this.pageData.content,
                    img: fileIds,
                    blogTag: this.data.blogTag,
                    createTime: db.serverDate()
                }
            }).then(res => {
                wx.hideLoading()
                wx.showToast({
                    title: '发布成功'
                })

                const pages = getCurrentPages()
                // if (pages > 1) {
                    wx.navigateBack()
                    const prevPage = pages[pages.length - 2]
                    prevPage.onPullDownRefresh()
                // }
            })

        }).catch(err => {
            wx.hideLoading()
            wx.showToast({
                title: '抱歉，发布失败',
                icon: "none"
            })
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.pageData.userInfo = options;
        this.setData({
            wordsNum: `${this.data.wordsNum}/${this.data.MAX_LENGTH}`,
            blogTag: options.blogTag
        })
    }
})
