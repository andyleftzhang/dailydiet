// components/blog-card/blog-card.js
var datefns = require('date-fns')

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blog: Object
    },

    observers: {
        ['blog.createTime'](val) {
            if (val) {
                this.setData({
                    _createTime: datefns.format(new Date(val), 'yyyy-MM-dd HH:mm:ss')
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {

        onPreviewImg(event){
            // console.log(event.target.dataset.index)
            let index = event.target.dataset.index
            wx.previewImage({
                current: this.data.blog.img[index],
                urls: this.data.blog.img
            })
        }
    }
})
