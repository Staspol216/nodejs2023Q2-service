import { createApp } from "vue";
import { initAuth } from "./auth";
import App from "../App.vue";

export const bootstrap = async () => {
  await initAuth();
  createApp(App).mount("#app");
};
