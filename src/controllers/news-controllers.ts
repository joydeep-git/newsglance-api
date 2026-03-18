import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "@/errors/error-responder";
import guardianNews from "@/services/news/guardian";
import newsDb from "@/services/news/news-db";
import { StatusCode } from "@/types";
import newsRedis from "@/services/redis/news-redis";


class NewsControllers {


  public async homePageNews(req: Request, res: Response, next: NextFunction) {

    try {

      const page = parseInt(String(req.query.page ?? "1"));

      const cachedNews = await newsRedis.getHomePageNews(page);

      if (cachedNews) {
        return res.status(StatusCode.OK).json({
          message: "Homescreen news fetched from cache!",
          data: cachedNews
        })
      }

      const news = await guardianNews.getHomeFeed(page);

      // set to redis
      await newsRedis.setHomePageNews(news, page);

      return res.status(200).json({
        message: "Homescreen News fetched from api!",
        data: news,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async getNewsById(req: Request, res: Response, next: NextFunction) {

    try {

      const { newsId } = req.params;

      if (!newsId) return next(errRes("NewsId is required!", StatusCode.BAD_REQUEST));


      // fetch from redis
      const cachedNews = await newsRedis.getSingleNews(newsId);

      if (cachedNews) {
        return res.status(StatusCode.OK).json({
          message: "News fetched!",
          data: cachedNews,
        })
      }

      const data = await guardianNews.getArticleById(newsId);

      await newsRedis.setSingleNews(data);

      return res.status(StatusCode.OK).json({
        message: "News fetched!",
        data,
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async categoryNews(req: Request, res: Response, next: NextFunction) {

    try {

      const { category } = req.params;

      const page = parseInt(String(req.query.page ?? "1"));

      if (!category) return next(errRes("Category is required!", StatusCode.BAD_REQUEST));

      const cachedNews = await newsRedis.getCategoryNews(category, page);

      if (cachedNews) {
        return res.status(StatusCode.OK).json({
          message: `${category} news fetched!`,
          data: cachedNews,
        });
      }

      const data = await guardianNews.getByCategory(category, page);

      await newsRedis.setCategoryNews({ category, news: data, page });

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

      const page = parseInt(String(req.query.page ?? "1"));

      if (!country) return next(errRes("Country is required!", StatusCode.BAD_REQUEST));

      const cachedNews = await newsRedis.getCountryNews(country, page);

      if (cachedNews) {
        return res.status(StatusCode.OK).json({
          message: `${country} news fetched!`,
          data: cachedNews,
        });
      }

      const news = await guardianNews.getByCountry(country, page);

      return res.json({
        news
      })

      await newsRedis.setCountryNews({ country, news, page });

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

      const { query, page } = req.query;

      if (!query) return next(errRes("No query!", StatusCode.BAD_REQUEST));

      const data = await guardianNews.search(String(query), Number(page?.toString() ?? "1"));

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


  public async getBookmark(req: Request, res: Response, next: NextFunction) {

    try {

      const bookmarkedNews = await newsDb.getBookmark(req.user.id);

      if (bookmarkedNews.length === 0) {
        return res.status(StatusCode.OK).json({
          message: "Saved News fetched!",
          data: []
        })
      }

      const allBookmarks = bookmarkedNews.map(bookmark => bookmark.newsId);

      const news = await guardianNews.getByIds(allBookmarks);

      return res.status(StatusCode.OK).json({
        message: "Saved news fetched!",
        data: news.data
      })

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