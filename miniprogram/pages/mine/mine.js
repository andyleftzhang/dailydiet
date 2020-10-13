// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeHeaderImg (event){
    console.log(event)
  },

  onGetQRCode(){
    wx.showLoading({
      title: '正在获取小程序码'
    })
    wx.cloud.callFunction({
      name: 'getQRcode'
    }).then(res=>{
      wx.hideLoading()
      // console.log(res)
      wx.previewImage({
        urls: [res.result],
        current: res.result
      })
    }).catch((err)=>{
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '网络出现异常~'
      })
    })
  }
})
