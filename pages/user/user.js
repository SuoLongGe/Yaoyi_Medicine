Page({
  data: {
    userInfo: {
      avatarUrl: '/images/1.png',  // 默认头像
      nickName: '未登录'
    },
    isLoggedIn: false // 用于判断用户是否登录
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
          // 如果用户已授权，则直接获取用户信息
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
          // 如果用户没有授权，则显示登录按钮
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
          // 获取用户信息
          wx.getUserInfo({
            success: info => {
              const userInfo = info.userInfo;
              this.setData({
                userInfo: userInfo,
                isLoggedIn: true
              });
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

  // 退出登录
  onLogout: function () {
    this.setData({
      userInfo: {
        avatarUrl: '/images/default-avatar.png',
        nickName: '未登录'
      },
      isLoggedIn: false
    });
  }
});
