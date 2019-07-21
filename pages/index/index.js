//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    swiperItem: [{src: '/resources/img/dior-poster-1.jpg', text: 'image'}, {src: '/resources/img/dior-poster-2.jpg', text: ''}],
    classifyMenuItem: [{text: "热门", icon: 'trending_up', color: 'indianred'}, {text: "新品", icon: 'fiber_new', color: '#009acd'}, {text: "洗面奶", icon: null}, {text: "面膜", icon: null}, {text: "更多", icon: 'expand_more'}],
    recommendItem: [{name: '【官方正品】MAC/魅可子弹头口红唇膏断货王 Ruby Woo/牛血色 ', price: 999, sold: 1200, thumbnail: '/resources/img/mac.jpg'}, {name: '【顺丰包邮】Dior/迪奥口红套装礼盒装10支蓝金女唇膏999官方香水', price: 688, sold: 25000, thumbnail: '/resources/img/dior.jpg'}],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getCommodity()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getCommodity: function () {
    let that = this
    wx.request({
      method: 'get',
      url: app.globalData.serverPath + '/commodity',
      success: (res) => {
        that.setData({
          recommendItem: res.data
        })
      }
    })
  },
  search (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/search-result/search-result?keyword=' + e.detail.value 
    })
  }
})
