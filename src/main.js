import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router';
import App from './App.vue'

import MainPage from "./components/MainPage.vue";
import MediaDetail from "./components/MediaDetail.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/", 
      name: "main-page",
      component: MainPage
    },
    {
      path: "/media/:id",
      name: "media-detail",
      component: MediaDetail
    },
  ]
});

const app = createApp(App);
app.use(router);
app.mount("#app");
