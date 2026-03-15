import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "@/errors/error-responder";
import guardianNews from "@/services/news/guardian";
import newsDb from "@/services/news/news-db";
import { StatusCode } from "@/types";
import newsRedis from "@/services/redis/news-redis";


class NewsControllers {


  public async homePageNews(_: Request, res: Response, next: NextFunction) {

    try {

      const cachedNews = await newsRedis.getHomePageNews();

      if (cachedNews) {

        return res.status(StatusCode.OK).json({
          message: "Homescreen News fetched!",
          data: cachedNews
        })

      }

      const news = await guardianNews.getHomeFeed();

      // set to redis
      await newsRedis.setHomePageNews(news);

      return res.status(200).json({
        message: "Homescreen News fetched!",
        data: news,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async categoryNews(req: Request, res: Response, next: NextFunction) {

    try {

      const { category } = req.params;

      if (!category) return next(errRes("Category is required!", StatusCode.BAD_REQUEST));

      const cachedNews = await newsRedis.getCategoryNews(category);

      if (cachedNews) {
        return res.status(StatusCode.OK).json({
          message: `${category} news fetched!`,
          data: cachedNews,
        });
      }

      const data = await guardianNews.getByCategory(category);

      await newsRedis.setCategoryNews({ category, news: data });

      return res.status(StatusCode.OK).json({
        message: `${category} news fetched!`,
        data,
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async countrynews(req: Request, res: Response, next: NextFunction) {

    try {

      const { country } = req.params;

      if (!country) return next(errRes("Country is required!", StatusCode.BAD_REQUEST));

      const news = await guardianNews.getByCountry(country);

      return res.status(200).json({
        message: `${country} news fetched!`,
        data: news,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async searchNews(req: Request, res: Response, next: NextFunction) {

    try {

      const { query } = req.params;

      if (!query) return next(errRes("No query!", StatusCode.BAD_REQUEST));

      const data = await guardianNews.search(query);

      return res.status(200).json({
        message: "News fetched for " + query,
        data
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async addBookmark(req: Request, res: Response, next: NextFunction) {

    try {

      const { newsId } = req.params;

      if (!newsId) return next(errRes("NewsId is required!", StatusCode.BAD_REQUEST));

      const bookmark = await newsDb.setBookmark({ newsId, userId: req.user.id });

      return res.status(StatusCode.OK).json({
        message: "Saved!",
        data: bookmark,
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async deleteBookmark(req: Request, res: Response, next: NextFunction) {

    try {

      const { newsId } = req.params;

      if (!newsId) return next(errRes("NewsId is required!", StatusCode.BAD_REQUEST));

      const data = await newsDb.deleteBookmark({ newsId, userId: req.user.id });

      return res.status(StatusCode.OK).json({
        message: "Removed!",
        data,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


}

const newsController = new NewsControllers();

export default newsController;