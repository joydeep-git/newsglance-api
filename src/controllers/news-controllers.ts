import { NextFunction, Request, Response } from "express";
import { errRes, errRouter } from "@/errors/error-responder";
import guardianNews from "@/services/news/guardian";
import newsDb from "@/services/news/news-db";
import { StatusCode } from "@/types";
import newsRedis from "@/services/redis/news-redis";
import userQueries from "@/prisma-utils/user-queries";
import polly from "@/services/aws/polly";
import filesQueries from "@/prisma-utils/files-queries";
import aiSummarization from "@/services/AI/summarization";


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

      await newsRedis.setCountryNews({ country, news, page });

      return res.status(200).json({
        message: `${country} news fetched!`,
        data: news,
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async searchNews(req: Request, res: Response, next: NextFunction) {

    try {

      const { q, page } = req.query;

      if (!q) return next(errRes("No q!", StatusCode.BAD_REQUEST));

      const data = await guardianNews.search(String(q), Number(page?.toString() ?? "1"));

      return res.status(200).json({
        message: "News fetched for " + q,
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


  public async summerizeNews(req: Request, res: Response, next: NextFunction) {

    try {

      const { newsId } = req.params;

      const { id: userId, newsBalance, isPremium } = req.user;

      if (!newsId) return next(errRes("NewsId not found!", StatusCode.BAD_REQUEST));

      // check user limit
      if (!isPremium && newsBalance < 1) return next(errRes("Daily limit used! Wait till midnight to reset", StatusCode.BAD_REQUEST));


      // search if news summerization already exists
      const newsData = await newsDb.getNewsData(newsId);

      let updatedUser = req.user;


      if (newsData?.summarization) {

        if (!isPremium) {
          updatedUser = await userQueries.updateUser({
            id: userId, data: {
              newsBalance: newsBalance - 1,
            }
          })
        }

        return res.status(StatusCode.OK).json({
          message: "Summerization fetched!",
          data: {
            summary: newsData.summarization,
            user: updatedUser,
          }
        })
      }


      // if not exists then get full news to generate summary
      let news = await newsRedis.getSingleNews(newsId);

      if (!news) {
        news = await guardianNews.getArticleById(newsId);
        await newsRedis.setSingleNews(news);
      }

      const data = await aiSummarization.generateSummary({ content: news.body, isAudio: false });

      await newsDb.setNewsdata({ newsId, type: "summary", value: data });

      if (!isPremium) {
        updatedUser = await userQueries.updateUser({
          id: userId, data: {
            newsBalance: newsBalance - 1,
          }
        })
      }

      return res.status(200).json({
        message: "Data fetched!",
        data: {
          user: updatedUser,
          summary: data,
        },
      })

    } catch (err) {
      return next(errRouter(err));
    }

  }


  public async generateAudio(req: Request, res: Response, next: NextFunction) {

    try {

      const { newsId } = req.params;

      if (!newsId) return next(errRes("NewsId not found!", StatusCode.BAD_REQUEST));

      const { id: userId, audioBalance, isPremium } = req.user;

      // check user limit
      if (!isPremium && audioBalance < 1) return next(errRes("Daily limit used! Wait till midnight to reset", StatusCode.BAD_REQUEST));


      // user data
      let updatedUser = req.user;


      // return audio if already generated
      const newsData = await newsDb.getNewsData(newsId);

      if (newsData?.audioFile) {

        // update audio balance
        if (!isPremium) {
          updatedUser = await userQueries.updateUser({
            id: userId,
            data: {
              audioBalance: audioBalance - 1,
            }
          })
        }


        return res.status(StatusCode.OK).json({
          message: "Audio fetched from db.",
          data: {
            user: updatedUser,
            audio: newsData.audioFile
          },
        });
      }


      // fetch article (from Redis or API)
      let news = await newsRedis.getSingleNews(newsId);

      if (!news) {
        news = await guardianNews.getArticleById(newsId);
        await newsRedis.setSingleNews(news);
      }


      //  gemini script
      const script = await aiSummarization.generateSummary({ content: news.body, isAudio: true });


      // polly generate MP3 and upload to s3
      const fileData = await polly.createAndUploadAudio(script, newsId);


      // create file record
      const fileRecord = await filesQueries.createNewFile({ file: fileData, type: "audio", url: fileData.url });


      // link file record to db
      await newsDb.setNewsdata({ newsId, type: "audio", value: fileRecord.id });


      // update user balance
      if (!isPremium) {
        updatedUser = await userQueries.updateUser({
          id: userId,
          data: { audioBalance: audioBalance - 1 },
        });
      }


      return res.status(StatusCode.OK).json({
        message: "Audio generated!",
        data: {
          user: updatedUser,
          audio: fileRecord
        },
      });

    } catch (err) {
      return next(errRouter(err));
    }

  }


}

const newsController = new NewsControllers();

export default newsController;