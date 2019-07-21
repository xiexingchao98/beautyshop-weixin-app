//app.js
App({
  globalData: {
    serverPath: 'http://localhost:8360',
    loginStatus: {}
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.loginStatus = wx.getStorageSync('loginStatus')
    console.log(this.globalData.loginStatus)
  },
  checkCameraAuthSetting (callback) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success () {
              callback()
            },
            fail () {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.camera'])
                    callback()
                  else
                    wx.showToast({ title: '相机授权失败', icon: 'none' })
                }
              })
            }
          })
        }
        else
          callback()
      } 
    })
  }
})