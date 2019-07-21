const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    loginStatus: {},
    checkboxItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      loginStatus: app.globalData.loginStatus
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
    console.log(app.globalData.loginStatus)
    let that = this
    if (app.globalData.loginStatus.isLogged) {
      wx.request({
        url: app.globalData.serverPath + '/cart',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          id: app.globalData.loginStatus.id
        },
        success: (res) => {
          that.genCheckboxItems(res.data)
          that.setData({
            cart: res.data
          })
          wx.setStorage({
            key: 'cart',
            data: res.data
          })
        }
      })
    }    
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
  increaseAmount (e) {
    let id = e.currentTarget.dataset.itemId
    console.log(id)
    this.changeAmount(id, 1)
  },
  decreaseAmount (e) {
    let id = e.currentTarget.dataset.itemId
    console.log(id)
    this.changeAmount(id, -1)
  },
  changeAmount (id, variation) {
    for (let index in this.data.cart) {
      if (this.data.cart[index].id == id) {
        if (this.data.cart[index].amount == 1 && variation == -1)
          return
        let newCart = this.data.cart
        newCart[index].amount += variation
        this.updateRemoteCart(newCart)
      }
    }
  },
  updateRemoteCart (newCart) {
    let that = this
    wx.request({
      method: 'post',
      url: app.globalData.serverPath + '/cart/update',
      data: {
        userID: that.data.loginStatus.id,
        item: newCart
      },
      success (res) {
        that.setData({ cart: newCart })
        wx.setStorage({
          key: 'cart',
          data: newCart
        })
      },
      fail () {
        wx.showToast({ tilte: '购物车信息同步失败', icon: 'none' })
        console.log('update remote cart fail')
      } 
    })
  },
  genCheckboxItems (cart) {
    let checkboxItems = []
    for (let index in cart) {
      checkboxItems.push({ value: cart[index].id.toString(), checked: false })
    }
    this.setData({
      checkboxItems: checkboxItems
    })
  },
  checkboxChange: function (e) {
    console.log(e)
    let values = e.detail.value
    let checkboxItems = this.data.checkboxItems
    for (let i  = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].checked = false
      for (let j = 0; j < values.length; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true
          break
        }
      }
    }
    this.setData({ checkboxItems: checkboxItems })
  },
  deleteCartItem () {
    let cart = this.data.cart
    let checkboxItems = this.data.checkboxItems
    let newCart = []
    for (let i = 0; i < checkboxItems.length; ++i) {
      if (!checkboxItems[i].checked) {
        newCart.push(cart[i])
      }
    }
    this.updateRemoteCart(newCart)
  },
  buyCartItem () {
    let cart = this.data.cart
    let checkboxItems = this.data.checkboxItems
    let orderItem = []
    let newCart = []
    for (let i = 0; i < checkboxItems.length; ++i) {
      if (checkboxItems[i].checked) {
        orderItem.push(cart[i])
      }
      else
        newCart.push(cart[i])
    }
    this.updateRemoteCart(newCart)
    app.globalData.orderItem = orderItem
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
})