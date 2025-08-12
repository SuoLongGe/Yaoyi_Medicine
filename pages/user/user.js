Page({
    data: {
      userInfo: {},
      isLoggedIn: false,
      openid: '',  // 存储获取到的 openid
    },
  
    onLoad: function () {
      // 页面加载时检查是否已登录
      this.checkLoginStatus();
    },
  
    onShow: function () {
      // 每次页面重新显示时检查登录状态
      this.checkLoginStatus();
    },
  
    // 检查登录状态
    checkLoginStatus: function () {
      const openid = wx.getStorageSync('openid'); // 从缓存获取 openid
      if (openid) {
        this.setData({
          isLoggedIn: true,
          openid: openid,
          userInfo: wx.getStorageSync('userInfo') || {},  // 从缓存获取用户信息
        });
      } else {
        this.setData({
          isLoggedIn: false,
          openid: '',
          userInfo: {},
        });
      }
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
                  isLoggedIn: true,
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
        name: 'getOpenid',  // 云函数名称
        success: res => {
          if (res.result && res.result.userInfo && res.result.userInfo.openId) {  // 访问 userInfo.openId
            const openid = res.result.userInfo.openId;   // 修改为 userInfo.openId
            wx.setStorageSync('openid', openid);
            wx.setStorageSync('userInfo', this.data.userInfo);  // 将用户信息存储到缓存
  
            // 设置 openid 到页面数据中
            this.setData({
              openid: openid
            });
  
            // 输出 openid 到控制台
            console.log('成功获取 openid:', openid);
          } else {
            console.error('返回结果没有 openId:', res);
          }
        },
        fail: err => {
          console.error('获取 openid 失败', err);
        }
      });
    },
  
    // 退出登录
    onLogout: function () {
      this.setData({
        userInfo: { avatarUrl: '/images/default-avatar.png', nickName: '未登录' },
        isLoggedIn: false,
        openid: '',  // 清空 openid
      });
      wx.removeStorageSync('openid');  // 移除本地存储的 openid
      wx.removeStorageSync('userInfo');  // 移除本地存储的用户信息
    },
  
    // 跳转到收藏页面
    onGoToFavorites: function () {
      const openid = this.data.openid;
      wx.navigateTo({
        url: `/pages/favorites/favorites?openid=${openid}`  // 传递 openid
      });
    },
  
    // 点击底部导航栏的处理函数
    onTabClick: function (e) {
      const page = e.currentTarget.dataset.page;  // 获取点击的页面名称
      switch (page) {
        case 'index':
          wx.navigateTo({
            url: '/pages/index/index'
          });
          break;
        case 'user':
          // 已经在用户页面，不需要跳转
          break;
        case 'news':
          wx.navigateTo({
            url: '/pages/news/news'
          });
          break;
        case 'search':
          wx.navigateTo({
            url: '/pages/search/search'
          });
          break;
        default:
          break;
      }
    }
  });
  