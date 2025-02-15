Page({
    data: {
      userFavorites: [],   // 存储用户的收藏数据
      pageSize: 20,        // 每次加载的数据条数
      currentPage: 1,      // 当前加载的页数
      hasMore: true,       // 是否还有更多数据
    },
  
    onLoad: function (options) {
      const openid = options.openid;  // 获取传递过来的 openid
      this.getUserFavorites(openid);  // 根据 openid 获取初始数据
    },
  
    // 获取用户收藏数据
    getUserFavorites: function (openid) {
      const db = wx.cloud.database();
      const { pageSize, currentPage } = this.data;
  
      // 根据分页查询
      db.collection('favorites')
        .where({ openid: openid })
        .skip((currentPage - 1) * pageSize)  // 跳过已经加载的部分
        .limit(pageSize)  // 限制每次查询的数据条数
        .get({
          success: res => {
            if (res.data.length > 0) {
              this.setData({
                userFavorites: [...this.data.userFavorites, ...res.data],  // 合并新数据
                currentPage: currentPage + 1,  // 更新当前页数
                hasMore: res.data.length === pageSize,  // 判断是否还有更多数据
              });
            } else {
              this.setData({
                hasMore: false,  // 没有更多数据
              });
            }
          },
          fail: err => {
            console.error('获取用户收藏数据失败', err);
          }
        });
    },
  
    // 滚动到底部时触发加载更多数据
    onReachBottom: function () {
      if (this.data.hasMore) {
        const openid = wx.getStorageSync('openid');  // 获取用户的 openid
        this.getUserFavorites(openid);  // 加载更多数据
      } else {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none',
        });
      }
    },
  
    // 点击收藏标题跳转到对应的页面
    goToDetail: function (event) {
      const pageUrl = event.currentTarget.dataset.pageUrl;  // 获取跳转链接
      wx.navigateTo({
        url: pageUrl  // 跳转到收藏的页面
      });
    }
  });
  