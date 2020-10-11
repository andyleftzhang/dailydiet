// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
const axios = require('axios')
const db = cloud.database()
const blogCollection = db.collection('blog')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()

    const app = new TcbRouter({event})

    app.router('list', async (ctx, next) => {
        let keyword = event.keyword
        let w = {}
        if (keyword.trim() !== '') {
            w = {
                content: db.RegExp({  //正则
                    regexp: keyword,
                    options: 'i'             //忽略大小写
                })
            }
        }
        ctx.body = await blogCollection
            .where(w)
            .skip(event.start)
            .limit(event.count)
            .orderBy('createTime', 'desc')
            .get()
            .then(async (res) => {
                return res.data;
            })
    })

    // return {
    //   event,
    //   openid: wxContext.OPENID,
    //   appid: wxContext.APPID,
    //   unionid: wxContext.UNIONID,
    // }

    return app.serve()
}
