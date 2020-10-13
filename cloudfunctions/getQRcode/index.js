// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

    try {
        //获取小程序码
        const result = await cloud.openapi.wxacode.getUnlimited({
            scene: wxContext.OPENID,
            // page: '/pages/'
        })
        // console.log(result)
        //将小程序码上传至云存储
        console.log(result.buffer)
        const upload = await cloud.uploadFile({
            cloudPath: 'qrCode/qr' + Date.now() + Math.random() * 1000 + '.png',
            fileContent: result.buffer
        })
        return upload.fileID
    } catch (err) {
        return err
    }
}