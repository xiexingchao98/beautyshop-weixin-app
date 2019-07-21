const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    amount: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: app.globalData.serverPath + '/commodity/view',
      method: 'get',
      data: {
        id: options.id
      },
      success: function (res) {
        that.setData({
          item: res.data
        })
      }
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
  decreaseAmount () {
    let that = this
    if (that.data.amount == 1)
      return
    that.setData({
      amount: that.data.amount - 1
    })
  },
  increaseAmount () {
    let that = this
    that.setData({
      amount: that.data.amount + 1
    })
  },
  addToCart: function () {
    let that = this
    let oldCart = wx.getStorageSync('cart');
    let newAddItem = {id: that.data.item.id, amount: that.data.amount, cover: that.data.item.cover, name: that.data.item.name, price: that.data.item.price }
    if (!oldCart) {
      oldCart = []
    }
    let newCart = oldCart
    newCart.push(newAddItem)
    wx.request({
      method: 'post',
      url: app.globalData.serverPath + '/cart/update',
      data: {
        item: newCart,
        userID: wx.getStorageSync('loginStatus').id
      },
      success: function () {
        wx.showToast({ title: '添加成功', icon: 'success' })
        wx.setStorage({ key: 'cart', data: newCart })
      },
      fail: function () {
        wx.showToast({ title: '添加失败', icon: 'none' })
        wx.setStorage({ key: 'cart', data: oldCart })
      }
    })
  },
  buyItem () {
    let item = this.data.item
    item['amount'] = this.data.amount
    app.globalData.orderItem = [item]
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
})