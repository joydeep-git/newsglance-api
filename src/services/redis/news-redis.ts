import redisService from "@/services/redis/redis";
import { ArticleCard, HomeResponse } from "@/types/news";
import Redis from "ioredis";



class NewsRedis {


  private redis: Redis = redisService.redis;

  private timeOut = 1800;

  private singleNewsTimeOut = 6000;


  // store single news
  public async setSingleNews(news: ArticleCard) {
    await this.redis.setex(`news:single:${news.id}`, this.singleNewsTimeOut, JSON.stringify(news));
  }

  // get single news
  public async getSingleNews(newsId: string) {
    return this.redis.get(`news:single:${newsId}`);
  }



  // ######### HOME SCREEN NEWS
  public async setHomePageNews(news: HomeResponse) {
    await this.redis.setex("news:homePage", this.timeOut, JSON.stringify(news));
  }

  // ######### HOME SCREEN NEWS GET
  public async getHomePageNews(): Promise<HomeResponse | null> {
    return JSON.parse(await this.redis.get("news:homePage") ?? "") ?? null;
  }



  // ######### CATEGORY NEWS SET
  public async setCategoryNews({ category, news }: { news: Object; category: string; }) {
    this.redis.setex(`news:category:${category}`, this.timeOut, JSON.stringify(news));
  }



  // ######### CATEGORY NEWS GET
  public async getCategoryNews(category: string): Promise<Object | null> {
    return JSON.parse(await this.redis.get(`news:category:${category}`) ?? "") ?? null;
  }



  // ######### COUNTRY NEWS SET
  public async setCountryNews({ country, news }: { news: Object; country: string; }) {
    this.redis.setex(`news:country:${country}`, this.timeOut, JSON.stringify(news));
  }



  // ######### COUNTRY NEWS GET
  public async getCountryNews(country: string): Promise<Object | null> {
    return JSON.parse(await this.redis.get(`news:country:${country}`) ?? "") ?? null;
  }




}


const newsRedis = new NewsRedis();

export default newsRedis;