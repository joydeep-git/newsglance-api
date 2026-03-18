
export type GuardianFields_Card = {
  headline: string;
  trailText: string;
  byline: string;
  wordcount: string;
  thumbnail: string;
};

export type GuardianFields_Detail = GuardianFields_Card & {
  main: string;
  body: string;
  lastModified: string;
  publication: string;
  shortUrl: string;
};

type GuardianArticleBase = {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
};

export type GuardianArticle_Card = GuardianArticleBase & {
  fields: GuardianFields_Card;
};

export type GuardianArticle_Detail = GuardianArticleBase & {
  fields: GuardianFields_Detail;
};

export type GuardianCardResponseType = {
  response: {
    status: "ok" | "error";
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianArticle_Card[];
  };
};

export type GuardianSingleNewsResponse = {
  response: {
    status: "ok" | "error";
    userTier: string;
    total: number;
    content: GuardianArticle_Detail;
  };
};


export type ArticleCard = {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  author: string;
  publishedAt: string;
  readTime: number;
  section: string;
  sourceUrl: string;
};


export type ArticleDetail = ArticleCard & {
  body: string;
  heroImage: string | null;
  publication: string;
  updatedAt: string | null;
  shareUrl: string | null;
};


export type NewsResponse = {
  data: ArticleCard[];
  currentPage: number;
  hasNextPage: boolean;
};


export type HomeResponse = {
  currentPage: number;
  hasNextPage: boolean;
  featured: ArticleCard[];
  finance: ArticleCard[];
  tech: ArticleCard[];
};


export type FetchOptions = {
  page?: number;
  pageSize?: number;
};


export type BookmarkType = {
  newsId: string;
  userId: string;
  createdAt: Date;
}