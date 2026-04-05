
import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";

import errorMiddleware from "./errors/error-middleware";
import routeErrorHandler from "./middleware/route-error-handler";
import { responseWrapper } from "./middleware/response-wrapper";

import authRouters from "./routers/auth-routers";
import userRouters from "./routers/user-routers";
import newsRouters from "./routers/news-routers";
import utilityRouters from "./routers/utility-routers";
import paymentRouters from "./routers/payment-routers";

import prismaSeeding from "./prisma-utils/prisma-seeding";



class Server {

  private app: Application;

  private readonly port: number;

  constructor() {

    dotenv.config();

    this.app = express();

    this.port = Number(process.env.PORT || 5000);

    this.runServer();

    this.startServer();

  }


  // running all methods

  private async runServer() {

    try {

      this.securityConfig();

      this.middlewareConfig();

      this.createRoutes();

      this.errorMiddlewareConfig();

      // create default image file on pg table
      await prismaSeeding();

    } catch (err) {

      console.log("Server Init Failed:", err);

      process.exit(1);

    }

  }


  // cors, handle rate limit and header security
  private securityConfig() {

    this.app.use(helmet());

    // trust reverse proxy
    this.app.set("trust proxy", 1);

    this.app.use(
      cors({
        origin: ['http://localhost:3000', 'https://newsglance.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
      })
    )

    // 300 req / 15 min / user
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: "Too many requests, at max we handle 300 requests per 15 minutes!" },
    }));

    // auth system abuse guard
    this.app.use("/api/auth", rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: "DONT SPAM OUR AUTHENTICATION SYSTEM!" },
    }));

  }


  // call middlewares for request body parser, cookies
  private middlewareConfig() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }


  // project base routes
  private createRoutes() {

    // warps successfully responses with success and error boolean value
    this.app.use(responseWrapper);

    this.app.use("/api/auth", authRouters);
    this.app.use("/api/user", userRouters);
    this.app.use("/api/news", newsRouters);
    this.app.use("/api/payment", paymentRouters);
    this.app.use("/api", utilityRouters);

  }


  // errors middlewares
  private errorMiddlewareConfig() {

    this.app.use(routeErrorHandler);

    this.app.use(errorMiddleware);

  }


  // start server
  private startServer() {

    this.app.listen(this.port, () => {
      console.log("Server is LIVE on: ", this.port);
    });

  }

}

new Server();
