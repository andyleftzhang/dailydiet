// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({event})

    app.router('msg', async (ctx, next) => {
      ctx.body = await cloud.openapi.security.msgSecCheck({
          content: event.content
      }).then(res => {
            console.log(res)
          return res;
        }).catch(err => {
           return err
        })
    })

    app.router('img', async (ctx, next) => {
        console.log(event)


        ctx.body = await cloud.openapi.security.imgSecCheck({
            media: {
                header: {
                    'Content-Type': 'application/octet-stream'
                },
                contentType: 'image/png',
                value: Buffer.from(event.img)
            }
        }).then(res => {
            console.log(res)
            return res;
        }).catch(err => {
            return err
        })
    })

    return app.serve()
}
