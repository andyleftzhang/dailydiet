// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userCollec = db.collection('user')

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
    const app = new TcbRouter({event})
    const wxContext = cloud.getWXContext()

    /**
     * 获取openid
     */
    app.router('login', async (ctx, next) => {
        ctx.body = {
            event,
            openid: wxContext.OPENID,
            appid: wxContext.APPID,
            unionid: wxContext.UNIONID,
            env: wxContext.ENV,
        }
    })

    /**
     * 添加用户表
     */
    app.router('addUser', async (ctx, next) => {
        let count = await userCollec.where({_id: wxContext.OPENID}).count().then(res => {
            return res.total
        })
        if (count === 0) {
            let res = await userCollec.add({
                data: {
                    ...event.userInfo,
                    _id: wxContext.OPENID,
                    createTime: db.serverDate()
                }
            }).then((res => {
                return res
            })).catch(err => {
                return err
            })
            ctx.body = {
                ...res
            }
        } else {
            ctx.body = {}
        }
    })

    app.router('getUserInfo', async (ctx, next) =>{

    })
    return app.serve()

}

