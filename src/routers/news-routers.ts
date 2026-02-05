import express , { Router } from "express";


class NewsRouters {

  public readonly router: Router = express.Router();


  constructor() {

    this.router.post("");

    this.router.get("");

    this.router.patch("");

  }

}

const newsRouters = new NewsRouters();

export default newsRouters.router;