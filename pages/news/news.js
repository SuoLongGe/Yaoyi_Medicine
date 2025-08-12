// pages/news/news.js
Page({
    data: {
      newsList: []  // 从云数据库获取的新闻记录
    },
  
    onLoad() {
      // 在加载数据前先进行去重
      this.removeDuplicateNews().then(() => {
        // 调用 fetchNews 云函数更新数据（也可以在云函数中处理重复数据）
        wx.cloud.callFunction({
          name: 'fetchNews',
          data: {},
          success: res => {
            console.log("fetchNews 返回结果：", res);
            // 更新成功后，再查询数据库获取最新数据
            this.loadNewsData();
          },
          fail: err => {
            console.error("调用 fetchNews 失败", err);
            // 调用失败时，也尝试查询数据库中已有的数据
            this.loadNewsData();
          }
        });
      });
    },
  
    // 查询数据库后，根据新闻链接删除重复数据
    removeDuplicateNews() {
      return new Promise((resolve, reject) => {
        const db = wx.cloud.database();
        db.collection('news').get({
          success: res => {
            const newsData = res.data;
            let uniqueMap = {};
            let duplicates = [];
            // 遍历新闻数据，标记重复的记录（保留第一个出现的记录）
            newsData.forEach(item => {
              if (uniqueMap[item.link]) {
                duplicates.push(item._id);
              } else {
                uniqueMap[item.link] = true;
              }
            });
            console.log("需要删除的重复记录ID：", duplicates);
            // 如果有重复记录，逐条删除
            if (duplicates.length > 0) {
              Promise.all(
                duplicates.map(id => {
                  return db.collection('news').doc(id).remove();
                })
              ).then(() => {
                console.log("重复数据删除完毕");
                resolve();
              }).catch(err => {
                console.error("删除重复数据时出错：", err);
                resolve(); // 出错时仍继续后续流程
              });
            } else {
              resolve();
            }
          },
          fail: err => {
            console.error("查询新闻数据失败：", err);
            resolve(); // 出错时仍继续后续流程
          }
        });
      });
    },
  
    // 封装的查询数据库方法，获取新闻数据
    loadNewsData() {
      const db = wx.cloud.database();
      db.collection('news')
        .orderBy('updateTime', 'desc')
        .get({
          success: res => {
            if (res.data && res.data.length > 0) {
              this.setData({ newsList: res.data });
            } else {
              wx.showToast({ title: '暂无新闻数据', icon: 'none' });
            }
          },
          fail: err => {
            console.error("查询数据库失败", err);
            wx.showToast({ title: '查询新闻失败', icon: 'none' });
          }
        });
    },
  
    // 底部导航栏点击处理函数
    onTabClick(e) {
      const page = e.currentTarget.dataset.page;
      switch (page) {
        case 'index':
          wx.navigateTo({ url: '/pages/index/index' });
          break;
        case 'user':
          wx.navigateTo({ url: '/pages/user/user' });
          break;
        case 'news':
          // 已经在资讯页面，不需要跳转
          break;
        case 'search':
          wx.navigateTo({ url: '/pages/search/search' });
          break;
        default:
          break;
      }
    },
  
    // 点击新闻条目后直接跳转到对应网站（通过 webview 页面）
    goToDetail(event) {
      const newsItem = event.currentTarget.dataset.news;
      const link = newsItem.link;
      if (link) {
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(link)}`
        });
      } else {
        wx.showToast({
          title: '无效链接',
          icon: 'none'
        });
      }
    }
  });
  