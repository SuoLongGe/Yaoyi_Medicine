Page({
  data: {
    userInfo: {},
    isLoggedIn: false,
    userFavorites: []  // 存储用户的收藏数据
  },

  onLoad: function () {
    // 页面加载时检查用户是否授权登录
    this.checkUserAuthorization();
  },

  // 检查用户是否已授权
  checkUserAuthorization: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (info) => {
              this.setData({
                userInfo: info.userInfo,
                isLoggedIn: true
              });
            },
            fail: () => {
              console.error('获取用户信息失败');
            }
          });
        } else {
          this.setData({
            isLoggedIn: false
          });
        }
      }
    });
  },

  // 微信登录
  onLogin: function () {
    wx.login({
      success: res => {
        if (res.code) {
          wx.getUserInfo({
            success: info => {
              const userInfo = info.userInfo;
              this.setData({
                userInfo: userInfo,
                isLoggedIn: true
              });

              // 调用云函数获取 openid
              this.getOpenid();
            },
            fail: err => {
              console.error('获取用户信息失败', err);
            }
          });
        }
      },
      fail: err => {
        console.error('登录失败', err);
      }
    });
  },

  // 获取 openid
  getOpenid: function () {
    wx.cloud.callFunction({
      name: 'getOpenid',  // 调用云函数名称
      success: res => {
        const openid = res.result.openid;
        wx.setStorageSync('openid', openid);

        // 获取用户的收藏数据
        this.getUserFavorites(openid);
      },
      fail: err => {
        console.error('获取 openid 失败', err);
      }
    });
  },

  // 获取用户收藏数据
  getUserFavorites: function (openid) {
    const db = wx.cloud.database();
    db.collection('favorites').where({
      openid: openid
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            userFavorites: res.data[0].favorites
          });
        }
      },
      fail: err => {
        console.error('获取用户收藏数据失败', err);
      }
    });
  },

  // 点击查看收藏按钮，跳转到收藏页面并传递数据
  onGoToFavorites: function () {
    const openid = wx.getStorageSync('openid');
    wx.navigateTo({
      url: `/pages/favorites/favorites?openid=${openid}`  // 传递 openid
    });
  },

  // 退出登录
  onLogout: function () {
    this.setData({
      userInfo: { avatarUrl: '/images/default-avatar.png', nickName: '未登录' },
      isLoggedIn: false,
      userFavorites: []  // 清空收藏数据
    });
    wx.removeStorageSync('openid');  // 移除本地存储的 openid
  }
});
