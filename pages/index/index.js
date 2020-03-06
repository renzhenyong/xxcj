//index.js

Page({
  data: {

  },
  onLoad: function () {
    wx.login({
      success: res => {
        console.log("res.code");
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // this.login(res.code);
      }
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }
})