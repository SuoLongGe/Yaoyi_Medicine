// 云函数：fetchNews/index.js
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init({
  env: 'supreme-4ggo1kaube9c4a60'
})

exports.main = async (event, context) => {
  const query = encodeURIComponent("瑶医文化")

  // 定义一个函数用于抓取指定页的数据
  const fetchNewsPage = async (page) => {
    // 每页偏移量 pn（假设每页返回 10 个结果）
    const pn = page * 10
    const url = `http://www.baidu.com/s?wd=${query}&pn=${pn}`
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      })
      const $ = cheerio.load(response.data)
      let pageNewsList = []
      $('div.result').each((i, elem) => {
        let title = $(elem).find('h3 a').text().trim()
        let description = $(elem).find('.c-abstract').text().trim() || "暂无简介"
        let link = $(elem).find('h3 a').attr('href')
        if (title && link) {
          pageNewsList.push({ title, description, link, updateTime: new Date() })
        }
      })
      console.log(`第 ${page} 页抓取到新闻数量：`, pageNewsList.length)
      return pageNewsList
    } catch (error) {
      console.error(`抓取第 ${page} 页时出错：`, error)
      return []
    }
  }

  try {
    // 指定需要抓取的页数（例如 3 页，共计约 30 条新闻）
    const pagesToFetch = 3
    // 并发抓取各页数据
    const results = await Promise.all(
      Array.from({ length: pagesToFetch }, (_, index) => fetchNewsPage(index))
    )
    
    // 合并所有页的数据
    let newsList = []
    results.forEach(pageNews => {
      newsList = newsList.concat(pageNews)
    })
    console.log('合并后总共抓取到的新闻数量（未去重）：', newsList.length)

    // 以链接为依据去重
    const uniqueNewsMap = {}
    newsList.forEach(item => {
      uniqueNewsMap[item.link] = item
    })
    newsList = Object.values(uniqueNewsMap)
    console.log('去重后新闻数量：', newsList.length)

    // 如果抓取到的新闻超过20条，则只取前20条
    if (newsList.length > 20) {
      newsList = newsList.slice(0, 20)
    }

    const db = cloud.database()
    if (newsList.length > 0) {
      // 清空新闻集合中的旧数据
      const oldNews = await db.collection('news').get()
      if (oldNews.data.length > 0) {
        await Promise.all(
          oldNews.data.map(item => db.collection('news').doc(item._id).remove())
        )
      }
      // 插入最新的新闻数据
      await Promise.all(
        newsList.map(item => db.collection('news').add({ data: item }))
      )
    }

    return { success: true, count: newsList.length }
  } catch (error) {
    console.error('抓取或写入数据库出错：', error)
    return { success: false, error: error.message }
  }
}
