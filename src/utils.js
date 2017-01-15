/**
 * Created by seal on 12/01/2017.
 */
import $ from 'jquery';

export function calculateSize(size) {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
}

// 保留两位数，去除多余的零
export function toFixedWithoutTrailingZero(num) {
  return Number(Number(num).toFixed(2)).toString();
}


/**
 *
 * @param url 请求路径
 * @param settings 请求设置
 */
export function ajax(url, settings) {
  return $.ajax(url, settings).catch(res => {
    if (res.status == 401) {
      location.href = 'login.html';
    } else {
      throw res;
    }
  });
}

export function transformArticle(articles) {
  let typeNameMap = {
    租赁类: [],
    消耗类: [],
    工具类: []
  };
  let nameArticleMap = {};
  articles.forEach(article => {
    typeNameMap[article.type].push(article.name);
    nameArticleMap[article.name] = article;
  });

  return {
    typeNameMap,
    nameArticleMap
  };
}
