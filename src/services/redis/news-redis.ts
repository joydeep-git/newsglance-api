import Redis from "ioredis";
import redisService from "@/services/redis/redis";
import { ArticleDetail, HomeResponse, NewsResponse } from "@/types/news";



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
    return JSON.parse(String(await this.redis.get(`news:single:${newsId}`))) ?? null;
  }



  // ######### HOME SCREEN NEWS
  public async setHomePageNews(news: HomeResponse, page: number) {
    await this.redis.setex(`news:homePage:page:${page}`, this.timeOut, JSON.stringify(news));
  }

  // ######### HOME SCREEN NEWS GET
  public async getHomePageNews(page: number): Promise<HomeResponse | null> {
    return JSON.parse(String(await this.redis.get(`news:homePage:page:${page}`))) ?? null;
  }



  // ######### CATEGORY NEWS SET
  public async setCategoryNews({ category, news, page }: { news: NewsResponse; category: string; page: number; }) {
    await this.redis.setex(`news:category:${category}:page:${page}`, this.timeOut, JSON.stringify(news));
  }



  // ######### CATEGORY NEWS GET
  public async getCategoryNews(category: string, page: number): Promise<NewsResponse | null> {
    return JSON.parse(String(await this.redis.get(`news:category:${category}:page:${page}`))) ?? null;
  }



  // ######### COUNTRY NEWS SET
  public async setCountryNews({ country, news, page }: { news: NewsResponse; country: string; page: number; }) {
    await this.redis.setex(`news:country:${country}:page:${page}`, this.timeOut, JSON.stringify(news));
  }



  // ######### COUNTRY NEWS GET
  public async getCountryNews(country: string, page: number): Promise<NewsResponse | null> {
    return JSON.parse(String(await this.redis.get(`news:country:${country}:page:${page}`))) ?? null;
  }

}


const newsRedis = new NewsRedis();

export default newsRedis;