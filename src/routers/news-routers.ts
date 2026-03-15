import newsController from "@/controllers/news-controllers";
import authToken from "@/middleware/auth-token";
import express , { Router } from "express";


class NewsRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.get("/homepage", newsController.homePageNews);
    
    this.router.get("/:category", newsController.categoryNews);
    
    this.router.get("/:country", newsController.countrynews);
    
    this.router.get("/:query", newsController.searchNews);

    this.router.get("/bookmark/:newsId", authToken.validator, newsController.addBookmark);

    this.router.delete("/bookmark/:newsId", authToken.validator, newsController.deleteBookmark);

    this.router.patch("");

  }

}

const newsRouters = new NewsRouters();

export default newsRouters.router;