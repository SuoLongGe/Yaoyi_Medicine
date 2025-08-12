// pages/webview/webview.js
Page({
    data: {
      url: '' // 存放传递过来的网页链接
    },
    onLoad(options) {
      if (options.url) {
        // 对 URL 进行解码并存入 data
        this.setData({
          url: decodeURIComponent(options.url)
        })
      }
    },
    // 返回上一页
    goBack() {
      wx.navigateBack({
        delta: 1
      })
    },
    // 如需处理 web-view 与小程序的消息传递，可使用 onMessage 事件
    onMessage(e) {
      console.log('收到webview消息：', e.detail.data)
    }
  })
  