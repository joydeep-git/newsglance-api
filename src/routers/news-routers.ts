import newsController from "@/controllers/news-controllers";
import authToken from "@/middleware/auth-token";
import express , { Router } from "express";


class NewsRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.get("/homepage", newsController.homePageNews);
    
    this.router.get("/category/:category", newsController.categoryNews);
    
    this.router.get("/country/:country(.*)", newsController.countrynews);
    
    this.router.get("/search", newsController.searchNews);

    this.router.get("/single/:newsId(.*)", newsController.getNewsById);

    this.router.post("/bookmark/:newsId", authToken.validator, newsController.addBookmark);

    this.router.get("/bookmark", authToken.validator, newsController.getBookmark);

    this.router.delete("/bookmark/:newsId", authToken.validator, newsController.deleteBookmark);

    this.router.get("/summary/:newsId(.*)", newsController.summerizeNews);

  }

}

const newsRouters = new NewsRouters();

export default newsRouters.router;