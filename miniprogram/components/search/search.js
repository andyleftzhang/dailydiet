// components/search/search.js
let keyword = ''
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder: {
            type: String,
            value: '请输入关键字'
        }
    },

    // 组件外部样式
    externalClasses: [
        'iconfont',
        'icon-sousuo'
    ],

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onInput(event) {
            // console.log(event)
            keyword = event.detail.value
        },
        onSearch() {
            this.triggerEvent('search',{
                keyword
            })
        },
        gotoMine(){
            this.triggerEvent('gotoMine',{
                openid: ''
            })
        }
    }
})
