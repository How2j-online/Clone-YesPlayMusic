import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store";
import router from "@/router";
import "@/assets/css/global.less";
import { setupI18n } from "@/locales/setupI18n";
const app = createApp(App);
const setupApp = async () => {
  await setupI18n(app);
  app.use(store).use(router).mount("#app");
};

setupApp().then(() => {});
