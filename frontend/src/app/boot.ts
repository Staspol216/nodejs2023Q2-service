import { createApp } from "vue";
import App from "../App.vue";
import { initDB } from "./db";
import { router } from "./router";

export const bootstrap = async () => {
  const db = await initDB();
  createApp(App).use(router).provide("db", db).mount("#app");
};
