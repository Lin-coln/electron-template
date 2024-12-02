import Koa from "koa";

const app = new Koa();
const port = 3000;

app.use((ctx) => {
  ctx.body = "hello world";
});

// @ts-ignore
if (import.meta.env.PROD) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export default app;
