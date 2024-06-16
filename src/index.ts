import { bodyParser } from "@koa/bodyparser";
import Koa from "koa";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response

router.get("/", async (ctx, next) => {
  await next();
  console.log(ctx.req.headers);
  console.log(ctx.req.method);
  ctx.body = "Hello /";
});

router.post("/foo", async (ctx) => {
  console.log("foo reached");
  console.log(ctx.request.body);
  ctx.body = "Hello /foo";
});

const port = 3000;

app.use(router.routes()).use(router.allowedMethods()).listen(3000);

console.log(`listening on port ${port}`);
