import db from "@/prisma-utils/db-client";
import { BookmarkType, NewsDataPropsType } from "@/types/news";


class NewsDb {


  public async setBookmark({ newsId, userId }: { newsId: string; userId: string; }): Promise<BookmarkType> {

    try {

      return await db.bookmark.create({
        data: {
          newsId,
          userId,
        }
      });

    } catch (err) {
      throw err;
    }

  }

  public async checkBookmark({ userId, newsId }: { userId: string; newsId: string; }): Promise<boolean> {

    try {

      const data = await db.bookmark.findFirst({ where: { userId, newsId } });

      return !!data;

    } catch (err) {
      throw err;
    }

  }

  public async getBookmark(userId: string): Promise<BookmarkType[]> {

    try {

      return await db.bookmark.findMany({
        where: {
          userId,
        }
      });

    } catch (err) {
      throw err;
    }

  }

  public async deleteBookmark({ newsId, userId }: { newsId: string; userId: string; }): Promise<BookmarkType> {

    try {
      return await db.bookmark.delete({
        where: {
          userId_newsId: {
            newsId,
            userId,
          }
        }
      });
    } catch (err) {
      throw err;
    }

  }

  public async setNewsdata({ newsId, type, value }: NewsDataPropsType) {

    try {

      const body = type === "audio" ? { audioFileId: value } : { summarization: value };

      return await db.newsData.upsert({
        where: { newsId },
        update: { ...body },
        create: { newsId, ...body }
      });

    } catch (err) {
      throw err;
    }

  }

  public async getNewsData(newsId: string) {

    try {

      return await db.newsData.findFirst({
        where: { newsId },
        include: {
          audioFile: true,
        }
      });

    } catch (err) {
      throw err;
    }

  }

}

const newsDb = new NewsDb();

export default newsDb;