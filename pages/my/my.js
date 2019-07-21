// pages/my/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [{text: '设置', url: '/pages/setting/setting', icon: 'settings'},{text: '关于', url: '/pages/about/about', icon: 'info'}],
    loginStatus: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      loginStatus: app.globalData.loginStatus
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res)
              let loginStatus = wx.getStorageSync('loginStatus')
              res.userInfo['id'] = loginStatus.id
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    })
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
  getUserInfo: function (e) {
    console.log(e)
    let userInfo = e.detail.userInfo
    if (userInfo) {
      wx.login({
        success: (res) => {
          console.log(res.code)
          wx.showLoading()
          wx.request({
            method: 'post',
            url: app.globalData.serverPath + '/user/login',
            header: {
              'Content-Type': 'application/json'
            },
            data: {
              code: res.code,
              userInfo: userInfo
            },
            success: (reqRes) => {
              userInfo['id'] = reqRes.data.id
              this.setData({ isLogged: true, userInfo: userInfo })
              wx.setStorageSync('loginStatus', { isLogged: true, id: reqRes.data.id });
              wx.showToast({ title: '登录成功', icon: 'success' })
            },
            fail: () => {
              wx.showToast({ title: '登录失败', icon: 'none' })
            }
          })
        }
      })
    }
    else
      wx.showToast({ title: '授权失败', icon: 'none' })
  } 
})