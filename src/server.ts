
import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";

import errorMiddleware from "@/error-handlers/error-middleware";
import routeErrorHandler from "@/middleware/route-error-handler";
import { responseWrapper } from "@/middleware/response-wrapper";


import paymentService from "@/services/payment-service/payment-service";

import authRouters from "@/routers/auth-routers";
import userRouters from "@/routers/user-routers";
import newsRouters from "@/routers/news-routers";
import utilityRouters from "@/routers/utility-routers";
import paymentRouters from "@/routers/payment-routers";

import prismaSeeding from "@/prisma-utils/prisma-seeding";

// Redis
import redisService from "@/services/redis-service/redis-service";

// AWS services
import cloudStorage from "@/services/aws-service/s3";




class Server {

  private app: Application;

  private readonly port: number;

  constructor() {

    try {

      dotenv.config();

      this.app = express();

      this.port = Number(process.env.PORT || 5000);

      void redisService;

      void cloudStorage;

      void paymentService;

      this.runServer();

    } catch (err) {

      console.log("Server.ts RUN SERVER ERROR:", err);

      process.exit(1);

    }

  }


  // running all methods

  private runServer() {

    this.securityConfig();

    this.middlewareConfig();

    this.createRoutes();

    this.errorMiddlewareConfig();

    this.startServer();

    void prismaSeeding().catch(err => console.log("Prisma Seeding ERROR:", err));

  }


  // cors, handle rate limit and header security
  private securityConfig() {

    this.app.use(helmet());

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
      })
    )

    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
    }))

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
