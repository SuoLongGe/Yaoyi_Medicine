Page({
    data: {
      userFavorites: [], // 存储用户的收藏数据
      pageSize: 20, // 每次加载的数据条数
      currentPage: 1, // 当前加载的页数
      hasMore: true, // 是否还有更多数据
    },
  
    onLoad: function (options) {
      // 获取传递的 openid 参数，如果没有传递，则从本地缓存获取
      const openid = options.openid || wx.getStorageSync('openid');
      if (openid) {
        this.getUserFavorites(openid); // 加载初始收藏数据
      } else {
        console.error('未获取到 openid');
      }
    },
  
    onShow: function () {
      // 每次页面重新显示时检查登录状态
      this.checkLoginStatus();
    },
  
    checkLoginStatus: function () {
      const openid = wx.getStorageSync('openid'); // 从缓存获取 openid
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
  
    // 获取用户收藏数据
    getUserFavorites: function (openid) {
      const db = wx.cloud.database();
      const { pageSize, currentPage } = this.data;
  
      db.collection('favorites')
        .where({ _openid: openid })  // 根据 openid 查询收藏数据
        .skip((currentPage - 1) * pageSize)  // 分页跳过已加载的数据
        .limit(pageSize)  // 限制每次加载的数量
        .get({
          success: res => {
            if (res.data.length > 0) {
              const oldList = this.data.userFavorites;
              const newList = oldList.concat(res.data);
  
              // 去重逻辑：避免重复收藏项
              const uniqueList = [];
              const seenMap = {};
              for (const item of newList) {
                if (!seenMap[item.pageUrl]) {
                  seenMap[item.pageUrl] = true;
                  uniqueList.push(item);
                }
              }
  
              this.setData({
                userFavorites: uniqueList,
                currentPage: currentPage + 1,
                hasMore: (res.data.length === pageSize),
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
  
    // 加载更多
    onReachBottom: function () {
      if (this.data.hasMore) {
        const openid = wx.getStorageSync('openid');
        this.getUserFavorites(openid);
      } else {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none',
        });
      }
    },
  
    // 点击查看收藏项详情
    goToDetail: function (event) {
      const pageUrl = event.currentTarget.dataset.pageUrl; // 获取点击项的 pageUrl
      wx.navigateTo({
        url: pageUrl  // 跳转到指定页面
      });
    }
  });
  