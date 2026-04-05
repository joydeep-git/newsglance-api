import Redis from "ioredis";
import redisService from "../../services/redis/redis";
import { ArticleDetail, HomeResponse, NewsResponse } from "../../types/news";



class NewsRedis {

  
  private redis: Redis = redisService.redis;

  private timeOut = 3600;

  private singleNewsTimeOut = 6000;


  // store single news
  public async setSingleNews(news: ArticleDetail) {
    await this.redis.setex(`news:single:${news.id}`, this.singleNewsTimeOut, JSON.stringify(news));
  }

  // get single news
  public async getSingleNews(newsId: string): Promise<ArticleDetail | null> {

    const res = await this.redis.get(`news:single:${newsId}`);

    if (!res) return null;

    return JSON.parse(res);
  }



  // home screen news SET
  public async setHomePageNews(news: HomeResponse, page: number) {
    await this.redis.setex(`news:homePage:page:${page}`, this.timeOut, JSON.stringify(news));
  }

  // home screen news GET
  public async getHomePageNews(page: number): Promise<HomeResponse | null> {

    const res = await this.redis.get(`news:homePage:page:${page}`);

    if (!res) return null;

    return JSON.parse(res);
  }



  // category news SET
  public async setCategoryNews({ category, news, page }: { news: NewsResponse; category: string; page: number; }) {
    await this.redis.setex(`news:category:${category}:page:${page}`, this.timeOut, JSON.stringify(news));
  }



  // category news GET
  public async getCategoryNews(category: string, page: number): Promise<NewsResponse | null> {

    const data = await this.redis.get(`news:category:${category}:page:${page}`);

    if (!data) return null;
    
    return JSON.parse(data);
  }



  // country news SET
  public async setCountryNews({ country, news, page }: { news: NewsResponse; country: string; page: number; }) {
    await this.redis.setex(`news:country:${country}:page:${page}`, this.timeOut, JSON.stringify(news));
  }



  // country news GET
  public async getCountryNews(country: string, page: number): Promise<NewsResponse | null> {
    
    const data = await this.redis.get(`news:country:${country}:page:${page}`);

    if (!data) return null;

    return JSON.parse(data);
  }

}


const newsRedis = new NewsRedis();

export default newsRedis;