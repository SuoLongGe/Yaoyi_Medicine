Page({
    data: {
      isCollected: false  // 用于判断当前页面是否已被收藏
    },
  
    // 点击收藏按钮时的处理逻辑
    onCollect: function () {
      const openid = wx.getStorageSync('openid');  // 获取当前用户的 openid
      const title = '中医药的基本知识';  // 当前页面的标题，用于判断是否已收藏
      const db = wx.cloud.database();
  
      // 查询该用户是否已经收藏过该条数据
      db.collection('favorites').where({
        openid: openid,
        title: title  // 检查是否已经收藏该标题
      }).get({
        success: res => {
          if (res.data.length > 0) {
            // 如果收藏项已存在，提示用户并取消收藏
            wx.showToast({
              title: '已收藏，取消收藏',
              icon: 'none'
            });
  
            // 删除收藏
            db.collection('favorites').where({
              openid: openid,
              title: title
            }).remove({
              success: res => {
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
            // 如果未收藏，进行收藏操作
            const collectionData = {
              title: title,  // 收藏的标题
              content: '中药是指来自植物、动物或矿物的天然物质，用于治疗疾病、调节身体的平衡。',
              timestamp: new Date().getTime(),  // 收藏的时间戳
              pageUrl: '/pages/medicine/medicine',  // 收藏的页面链接
              openid: openid  // 保存 openid 以便查询
            };
  
            // 将数据添加到收藏列表中
            db.collection('favorites').add({
              data: collectionData,
              success: res => {
                console.log('收藏成功', res);
                // 更新按钮状态，表示已收藏
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
  
    // 页面加载时检查是否已经收藏
    onLoad: function () {
      const openid = wx.getStorageSync('openid');  // 获取当前用户的 openid
      const title = '中医药的基本知识';  // 当前页面的标题，用于检查是否已收藏
      const db = wx.cloud.database();
  
      // 查询该用户是否已经收藏该项
      db.collection('favorites').where({
        openid: openid,
        title: title  // 检查是否已经收藏该标题
      }).get({
        success: res => {
          if (res.data.length > 0) {
            // 如果收藏项已存在，更新按钮状态
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
          url: '/pages/index/index'  // 跳转到首页，替换成你的首页路径
        });
      }
      
  });
  