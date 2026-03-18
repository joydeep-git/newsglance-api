import axios from "axios";
import { GuardianCardResponseType, GuardianSingleNewsResponse, GuardianArticle_Card, ArticleCard, ArticleDetail, NewsResponse, HomeResponse } from "@/types/news";
import { validSections } from "@/utils/constants";


const HOME_FINANCE_SECTION = "money";
const HOME_TECH_SECTION = "technology";
const HOME_FEATURED_COUNT = 50;
const HOME_FINANCE_COUNT = 5;
const HOME_TECH_COUNT = 10;
const WORDS_PER_MINUTE = 200;
const PAGE_SIZE = 50; // MAX 200 limit


class GuardianNews {


  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly CARD_FIELDS = "thumbnail,trailText,byline,wordcount,headline";
  private readonly DETAIL_FIELDS = "thumbnail,headline,trailText,body,main,wordcount,byline,publication,lastModified,shortUrl";



  constructor() {

    if (!process.env.GUARDIAN_API_URL || !process.env.GUARDIAN_API_KEY) {
      throw new Error("Missing env variables: GUARDIAN_API_URL and GUARDIAN_API_KEY are required");
    }

    this.baseUrl = process.env.GUARDIAN_API_URL;

    this.apiKey = process.env.GUARDIAN_API_KEY;

  }



  private toCard(raw: GuardianArticle_Card): ArticleCard {

    return {
      id: raw.id,
      title: raw.fields.headline || raw.webTitle,
      excerpt: raw.fields.trailText?.replace(/<[^>]*>/g, "").trim() ?? "",
      thumbnail: raw.fields.thumbnail ?? null,
      author: raw.fields.byline ?? "The Guardian",
      publishedAt: raw.webPublicationDate,
      readTime: Math.ceil(Number(raw.fields.wordcount ?? 0) / WORDS_PER_MINUTE),
      section: raw.sectionName,
      sourceUrl: raw.webUrl,
    };

  }



  private extractHeroImage(mainHtml: string): string | null {
    return mainHtml.match(/src="([^"]+)"/)?.[1] ?? null;
  }




  private async fetchCards(endpoint: string, params: Record<string, string | number>, fields: string = this.CARD_FIELDS): Promise<NewsResponse> {

    const searchParams = new URLSearchParams({
      "api-key": this.apiKey,
      "show-fields": fields,
      "order-by": "newest",
      "page-size": String(params["page-size"] ?? PAGE_SIZE),
      "page": String(params["page"] ?? 1),
      ...Object.fromEntries(
        Object.entries(params)
          .filter(([k]) => k !== "page-size" && k !== "page")
          .map(([k, v]) => [k, String(v)])
      ),
    });

    try {

      const res = await axios.get<GuardianCardResponseType>(
        `${this.baseUrl}${endpoint}?${searchParams.toString()}`
      );

      const { results, currentPage, pages } = res.data.response;

      return {
        data: results.map((raw) => this.toCard(raw)),
        currentPage: currentPage,
        hasNextPage: currentPage < pages,
      };

    } catch (err) {
      throw err;
    }
  }



  // Home feed — 3 requests
  async getHomeFeed(page: number): Promise<HomeResponse> {

    const [featuredResult, financeResult, techResult] = await Promise.allSettled([

      this.fetchCards("/search", { "page-size": HOME_FEATURED_COUNT, page }),

      this.fetchCards(`/${HOME_FINANCE_SECTION}`, { "page-size": HOME_FINANCE_COUNT }),

      this.fetchCards(`/${HOME_TECH_SECTION}`, { "page-size": HOME_TECH_COUNT }),
    ]);

    return {
      currentPage: featuredResult.status === "fulfilled" ? featuredResult.value.currentPage : 1,
      hasNextPage: featuredResult.status === "fulfilled" ? featuredResult.value.hasNextPage : false,
      featured: featuredResult.status === "fulfilled" ? featuredResult.value.data : [],
      finance: financeResult.status === "fulfilled" ? financeResult.value.data : [],
      tech: techResult.status === "fulfilled" ? techResult.value.data : [],
    };

  }



  // Category wise
  async getByCategory(category: string, page: number): Promise<NewsResponse> {
    if (!validSections.includes(category)) {
      throw new Error(`Invalid category: "${category}". Must be one of: ${validSections.join(", ")}`);
    }
    return this.fetchCards(`/${category}`, {
      page: page,
      "page-size": PAGE_SIZE,
    });
  }



  // Country wise
  async getByCountry(countryTag: string, page: number): Promise<NewsResponse> {
    return this.fetchCards(`/country/${countryTag}`, {
      page: page,
      "page-size": PAGE_SIZE,
    });
  }



  // Single article
  async getArticleById(id: string): Promise<ArticleDetail> {

    const url = `${this.baseUrl}/${id}?api-key=${this.apiKey}&show-fields=${this.DETAIL_FIELDS}`;

    try {

      const res = await axios.get<GuardianSingleNewsResponse>(url);

      const raw = res.data.response.content;

      return {
        id: raw.id,
        title: raw.fields.headline || raw.webTitle,
        excerpt: raw.fields.trailText?.replace(/<[^>]*>/g, "").trim() ?? "",
        thumbnail: raw.fields.thumbnail ?? null,
        author: raw.fields.byline ?? "The Guardian",
        publishedAt: raw.webPublicationDate,
        readTime: Math.ceil(Number(raw.fields.wordcount ?? 0) / WORDS_PER_MINUTE),
        section: raw.sectionName,
        sourceUrl: raw.webUrl,
        body: raw.fields.body ?? "",
        heroImage: raw.fields.main
          ? this.extractHeroImage(raw.fields.main)
          : raw.fields.thumbnail ?? null,
        publication: raw.fields.publication ?? "The Guardian",
        updatedAt: raw.fields.lastModified ?? null,
        shareUrl: raw.fields.shortUrl ?? null,
      };

    } catch (err) {
      throw err;
    }
  }



  // Bookmarks
  async getByIds(ids: string[]): Promise<NewsResponse> {

    if (ids.length === 0) return { data: [], currentPage: 1, hasNextPage: false };

    return this.fetchCards("/search", {
      ids: ids.join(","),
      "page-size": ids.length,
    });

  }



  // Search
  async search(query: string, page: number): Promise<NewsResponse> {
    return this.fetchCards("/search", {
      q: query,
      page: page,
      "page-size": PAGE_SIZE,
    });
  }


}

const guardianNews = new GuardianNews();

export default guardianNews;
