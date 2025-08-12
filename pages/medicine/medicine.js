Page({
    data: {
      isCollected: false  // 收藏状态
    },
  
    // 点击收藏按钮时的处理逻辑
    onCollect: function () {
      const openid = wx.getStorageSync('openid');  // 获取当前用户的 openid
      const pageUrl = '/pages/medicine/medicine';    // 唯一标识
      const title = '中医药的基本知识';             // 收藏标题
      const db = wx.cloud.database();
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
      // 查询该用户是否已经收藏过该条数据（使用 _openid 和 pageUrl 作为条件）
      db.collection('favorites').where({
        _openid: openid,
        pageUrl: pageUrl
      }).get({
        success: res => {
          if (res.data.length > 0) {
            // 如果收藏项已存在，提示用户并取消收藏
            wx.showToast({
              title: '已收藏，取消收藏',
              icon: 'none'
            });
            // 删除收藏记录
            db.collection('favorites').where({
              _openid: openid,
              pageUrl: pageUrl
            }).remove({
              success: () => {
                this.setData({
                  isCollected: false  // 更新按钮状态为未收藏
                });
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'success'
                });
              },
              fail: err => {
                console.error('取消收藏失败', err);
              }
            });
          } else {
            // 如果未收藏，则执行收藏操作
            const collectionData = {
              title: title,
              content: '中药是指来自植物、动物或矿物的天然物质，用于治疗疾病、调节身体的平衡。',
              timestamp: new Date().getTime(),
              pageUrl: pageUrl
              // 不需要传入 openid，云开发会自动注入 _openid
            };
  
            db.collection('favorites').add({
              data: collectionData,
              success: () => {
                this.setData({
                  isCollected: true
                });
                wx.showToast({
                  title: '收藏成功',
                  icon: 'success'
                });
              },
              fail: err => {
                console.error('收藏失败', err);
              }
            });
          }
        },
        fail: err => {
          console.error('查询失败', err);
        }
      });
    },
   
    // 页面加载时检查是否已收藏
    onLoad: function () {
      const openid = wx.getStorageSync('openid');  // 获取当前用户的 openid
      const pageUrl = '/pages/medicine/medicine';    // 唯一标识
      const db = wx.cloud.database();
  
      // 查询该用户是否已经收藏（使用 _openid 和 pageUrl 作为条件）
      db.collection('favorites').where({
        _openid: openid,
        pageUrl: pageUrl
      }).get({
        success: res => {
          if (res.data.length > 0) {
            this.setData({
              isCollected: true
            });
          }
        },
        fail: err => {
          console.error('查询失败', err);
        }
      });
    },
  
    // 返回上一页
    goBack: function () {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  });
  