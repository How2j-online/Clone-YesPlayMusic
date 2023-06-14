import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store";
import router from "@/router";
import "@/assets/css/global.less";
import { setupI18n } from "@/locales/setupI18n";
import { setupGlobDirectives } from "@/directive";

const app = createApp(App);

const setupApp = async () => {
  await setupI18n(app);
  setupGlobDirectives(app);
  app.use(store).use(router).mount("#app");
};

setupApp().then(() => {});
