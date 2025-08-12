Page({
    data: {
      herbId: null,
      herbInfo: {},
      isCollected: false
    },
  
    onLoad(options) {
      const { id } = options;
      this.setData({ herbId: id });
  
      // 模拟数据，实际项目中可从后端获取
      const herbData = {
        1: { 
          name: "人参", 
          description: "人参是一种名贵的中草药，具有补气养生、增强免疫力的功效。常用于气虚体弱、疲劳过度等症状。",
          img: "/images/herb1.png"
        },
        2: { 
          name: "黄芪", 
          description: "黄芪具有益气固表、托毒排脓的作用。长期服用可增强免疫力，提高身体抵抗力。",
          img: "/images/herb2.png"
        },
        3: { 
          name: "当归", 
          description: "当归常用于补血活血，调经止痛。尤其适用于女性身体调理，被誉为‘妇科圣药’。",
          img: "/images/herb3.png"
        }
      };
  
      const herbInfo = herbData[id] || {};
      this.setData({ herbInfo });
  
      // 构造当前草药的唯一标识：用于收藏时的 pageUrl
      const pageUrl = `/pages/preDetail/preDetail?id=${id}`;
      const openid = wx.getStorageSync('openid');
      const db = wx.cloud.database();
  
      // 查询该草药是否已经被收藏
      if (openid) {
        db.collection('favorites').where({
          _openid: openid,
          pageUrl: pageUrl
        }).get({
          success: res => {
            if (res.data.length > 0) {
              this.setData({ isCollected: true });
            }
          },
          fail: err => {
            console.error('查询收藏状态失败', err);
          }
        });
      }
    },
  
    // 收藏或取消收藏的处理函数
    onCollect() {
      const openid = wx.getStorageSync('openid');
      const { herbId, herbInfo, isCollected } = this.data;
      const pageUrl = `/pages/preDetail/preDetail?id=${herbId}`;
      const db = wx.cloud.database();
  
      // ────────────── 判断是否已经登录 ──────────────
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
      // ─────────────────────────────────────────────
  
      if (isCollected) {
        // 已收藏，则执行取消收藏操作
        db.collection('favorites').where({
          _openid: openid,
          pageUrl: pageUrl
        }).remove({
          success: res => {
            this.setData({ isCollected: false });
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
        // 未收藏，则执行收藏操作
        const collectionData = {
          title: herbInfo.name,
          content: herbInfo.description,
          timestamp: new Date().getTime(),
          pageUrl: pageUrl
          // 云开发会自动注入 _openid，无需手动传入
        };
        db.collection('favorites').add({
          data: collectionData,
          success: res => {
            this.setData({ isCollected: true });
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
    }
  });
  