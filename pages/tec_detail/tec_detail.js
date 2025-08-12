// pages/tec_detail/tec_detail.js
Page({
    data: {
      id: '',  // 当前疗法的 ID
      name: '',  // 疗法的名称
      brief: '',  // 疗法的简介
      effect: '',  // 疗法的效果
      scope: '',  // 疗法的适用范围
      method: '',  // 疗法的使用方法
      restriction: '',  // 疗法的使用禁忌
      attention: '',  // 疗法的注意事项
      handle: '',  // 疗法的操作步骤
      isLoggedIn: false,  // 用户登录状态
      openid: '',  // 用户的 openid
      isFavorite: false,  // 收藏状态
    },
  
    onLoad(options) {
      // 设置当前疗法的详细信息
      this.setData({
        id: options.id,
        name: decodeURIComponent(options.name),
        brief:decodeURIComponent(options.brief),
        effect: decodeURIComponent(options.effect).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(100\)/g, '\n    '),
        scope: decodeURIComponent(options.scope).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(100\)/g, '\n    '),
        method: decodeURIComponent(options.method).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(5\)/g, '\n   (5)').replace(/\(6\)/g, '\n   (6)').replace(/\(7\)/g, '\n   (7)').replace(/\(8\)/g, '\n   (8)').replace(/\(9\)/g, '\n   (9)').replace(/\(10\)/g, '\n   (10)').replace(/\(100\)/g, '\n    '),
        restriction: decodeURIComponent(options.restriction).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(5\)/g, '\n   (5)').replace(/\(6\)/g, '\n   (6)').replace(/\(7\)/g, '\n   (7)').replace(/\(8\)/g, '\n   (8)').replace(/\(9\)/g, '\n   (9)').replace(/\(10\)/g, '\n   (10)').replace(/\(100\)/g, '\n    '),
        attention: decodeURIComponent(options.attention).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(5\)/g, '\n   (5)').replace(/\(6\)/g, '\n   (6)').replace(/\(7\)/g, '\n   (7)').replace(/\(8\)/g, '\n   (8)').replace(/\(9\)/g, '\n   (9)').replace(/\(10\)/g, '\n   (10)').replace(/\(100\)/g, '\n    '),
        handle: decodeURIComponent(options.handle).replace(/\(1\)/g, '\n   (1)').replace(/\(2\)/g, '\n   (2)').replace(/\(3\)/g, '\n   (3)').replace(/\(4\)/g, '\n   (4)').replace(/\(5\)/g, '\n   (5)').replace(/\(6\)/g, '\n   (6)').replace(/\(7\)/g, '\n   (7)').replace(/\(8\)/g, '\n   (8)').replace(/\(9\)/g, '\n   (9)').replace(/\(10\)/g, '\n   (10)').replace(/\(100\)/g, '\n    ')
      });
  
      this.checkLoginStatus();  // 检查用户是否登录
      this.checkFavorite();      // 检查是否已收藏
    },
  
    // 检查登录状态
    checkLoginStatus() {
      const openid = wx.getStorageSync('openid');  // 获取 openid
      if (openid) {
        this.setData({
          isLoggedIn: true,
          openid: openid,
        });
      } else {
        this.setData({
          isLoggedIn: false,
          openid: '',
        });
      }
    },
  
    // 检查当前疗法是否已经被收藏
    checkFavorite() {
      const openid = this.data.openid;
  
      // 完整的 pageUrl，包括所有传递的参数
      const pageUrl = `/pages/tec_detail/tec_detail?id=${this.data.id}&name=${encodeURIComponent(this.data.name)}&brief=${encodeURIComponent(this.data.brief)}&effect=${encodeURIComponent(this.data.effect)}&scope=${encodeURIComponent(this.data.scope)}&method=${encodeURIComponent(this.data.method)}&restriction=${encodeURIComponent(this.data.restriction)}&attention=${encodeURIComponent(this.data.attention)}&handle=${encodeURIComponent(this.data.handle)}`;
  
      if (!openid) return;
  
      const db = wx.cloud.database();
      const favoritesCollection = db.collection('favorites');
  
      // 根据 _openid 和 pageUrl 查询收藏记录
      favoritesCollection.where({
        _openid: openid,
        pageUrl: pageUrl,
      }).get({
        success: (res) => {
          if (res.data.length > 0) {
            this.setData({ isFavorite: true });  // 如果已经收藏，设置为已收藏
          } else {
            this.setData({ isFavorite: false });  // 如果没有收藏，设置为未收藏
          }
        },
        fail: (err) => {
          console.error('查询收藏失败:', err);
        }
      });
    },
  
    // 收藏或取消收藏
    toggleFavorite() {
      const openid = this.data.openid;
  
      // 完整的 pageUrl，包括所有传递的参数
      const pageUrl = `/pages/tec_detail/tec_detail?id=${this.data.id}&name=${encodeURIComponent(this.data.name)}&brief=${encodeURIComponent(this.data.brief)}&effect=${encodeURIComponent(this.data.effect)}&scope=${encodeURIComponent(this.data.scope)}&method=${encodeURIComponent(this.data.method)}&restriction=${encodeURIComponent(this.data.restriction)}&attention=${encodeURIComponent(this.data.attention)}&handle=${encodeURIComponent(this.data.handle)}`;
  
      // 如果用户未登录，弹出提示框并跳转到登录页面
      if (!openid) {
        wx.showModal({
          title: '提示',
          content: '请先登录',
          confirmText: '去登录',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 用户点击“去登录”
              wx.navigateTo({
                url: '/pages/user/user'
              });
            }
          }
        });
        return;
      }
  
      // 获取当前疗法的收藏信息
      const favoriteItem = {
        timestamp: new Date().getTime(),
        title: this.data.name,
        content: this.data.brief,
        pageUrl: pageUrl
      };
  
      // 将收藏项保存到云数据库
      const db = wx.cloud.database();
      const favoritesCollection = db.collection('favorites');
  
      // 检查该用户是否已经收藏过该疗法
      favoritesCollection.where({
        _openid: openid,
        pageUrl: pageUrl
      }).get({
        success: (res) => {
          if (res.data.length === 0) {
            // 没有收藏过，执行收藏操作
            favoritesCollection.add({
              data: favoriteItem,
              success: () => {
                wx.showToast({
                  title: '收藏成功',
                  icon: 'success',
                });
                this.setData({ isFavorite: true });
              }
            });
          } else {
            // 已收藏，执行取消收藏操作
            favoritesCollection.doc(res.data[0]._id).remove({
              success: () => {
                wx.showToast({
                  title: '取消收藏',
                  icon: 'none',
                });
                this.setData({ isFavorite: false });
              }
            });
          }
        },
        fail: (err) => {
          console.error('查询收藏失败:', err);
        }
      });
    }
  });
  