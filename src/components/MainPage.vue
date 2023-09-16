<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const currentOrientation = ref(
  window.innerWidth > window.innerHeight ? "landscape" : "portrait"
);

const router = useRouter();

const selectedMediaType = ref("movie");
const movies = ref([]);
const tvShows = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

const baseImageUrl = "https://image.tmdb.org/t/p/w500";

const isMovieActive = computed(() => selectedMediaType.value === "movie");
const isTvActive = computed(() => selectedMediaType.value === "tv");

onMounted(async () => {
  try {
    const apiKey = "ec72b3f27c67f168bb4a09806137d4d7";
    await loadMedia(apiKey, "movie", currentPage.value);
    await loadMedia(apiKey, "tv", currentPage.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const loadMedia = async (apiKey, mediaType, page) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${apiKey}&language=ru-RU&page=${page}`
  );
  if (mediaType === "movie") {
    movies.value = [...movies.value, ...response.data.results];
  } else if (mediaType === "tv") {
    tvShows.value = [...tvShows.value, ...response.data.results];
  }
  totalPages.value = response.data.total_pages;
};

const getImageUrl = (path) => {
  return path ? `${baseImageUrl}${path}` : "";
};

const goToMediaDetail = (media) => {
  router.push({
    name: "media-detail",
    params: { id: media.id },
    query: { mediaType: selectedMediaType.value },
  });
};

window.addEventListener("scroll", async () => {
  const scrollX = window.scrollX;
  const windowWidth = window.innerWidth;
  const documentWidth = document.documentElement.scrollWidth;

  if (!isLoading.value && scrollX + windowWidth >= documentWidth - 10) {
    if (currentPage.value < totalPages.value) {
      isLoading.value = true;
      currentPage.value++;
      const apiKey = "ec72b3f27c67f168bb4a09806137d4d7";
      await loadMedia(apiKey, selectedMediaType.value, currentPage.value);
      isLoading.value = false;
    }
  }
});

watch(
  () => ({ width: window.innerWidth, height: window.innerHeight }),
  ({ width, height }) => {
    currentOrientation.value = width > height ? "landscape" : "portrait";
  },
  { immediate: true }
);
</script>

<template>
  <div class="container" :class="currentOrientation">
    <nav class="nav">
      <h3>Что популярно</h3>
      <div class="nav-container">
        <button
          class="nav-button"
          @click="selectedMediaType = 'tv'"
          :class="{ 'active-button': isTvActive }"
        >
          По ТВ
        </button>
        <button
          class="nav-button"
          @click="selectedMediaType = 'movie'"
          :class="{ 'active-button': isMovieActive }"
        >
          В кинотеатрах
        </button>
      </div>
    </nav>
    <div v-if="selectedMediaType === 'tv'">
      <ul class="movie-list">
        <router-link
          :to="{
            name: 'media-detail',
            params: { id: media.id },
            query: { mediaType: selectedMediaType },
          }"
          class="movie-list_item"
          v-for="media in tvShows"
          :key="media.id"
          @click="goToMediaDetail(media)"
        >
          <img
            class="item-img"
            :src="getImageUrl(media.poster_path)"
            alt="TV Show Poster"
          />
          <div class="vote">
            {{ media.vote_average }}
          </div>
          {{ media.name }}
          <p class="item-date">{{ media.release_date }}</p>
        </router-link>
      </ul>
    </div>
    <div v-else-if="selectedMediaType === 'movie'">
      <ul class="movie-list">
        <router-link
          :to="{
            name: 'media-detail',
            params: { id: media.id },
            query: { mediaType: selectedMediaType },
          }"
          class="movie-list_item"
          v-for="media in movies"
          :key="media.id"
          @click="goToMediaDetail(media)"
        >
          <img
            class="item-img"
            :src="getImageUrl(media.poster_path)"
            alt="Movie Poster"
          />
          <div class="vote">
            {{ media.vote_average }}
          </div>
          {{ media.title }}
          <p class="item-date">{{ media.release_date }}</p>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  margin: 15px 0;
  font-size: 24px;
  font-family: Roboto;
  gap: 30px;
  position: fixed;
  top: 0px;
}

.movie-list {
  margin-top: 50px;
  display: flex;
  gap: 20px;
  max-width: calc(250px + 20px);
}

.movie-list::-webkit-scrollbar {
  display: none;
}

.movie-list_item {
  text-align: start;
  font-weight: 600;
  position: relative;
}

.item-img {
  max-width: 250px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.vote {
  position: absolute;
  bottom: 15%;
  left: 5%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 9px;
  border-radius: 50%;
  font-size: 16px;
}

.item-date {
  margin-top: 5px;
  font-weight: 400;
  color: #b3b3b3;
}

.nav-container {
  border: 1px solid #184172;
  border-radius: 16px;
  display: flex;
}

button {
  background: transparent;
  padding: 6px 15px;
  border: none;
  border-radius: 16px;
  font-family: Roboto;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
}
.active-button {
  background-color: #184172;
  color: #65c5b1;
}

.nav-button {
  animation: buttonSwitch 0.5s ease-in-out;
}

.landscape .movie-list {
  display: flex;
  gap: 20px;
  max-width: calc(500px + 20px);
  justify-content: space-between;
}

.landscape .movie-list_item {
  width: calc(50% - 10px);
}

.portrait .movie-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

@keyframes buttonSwitch {
  0%,
  100% {
    background-color: #184172;
    color: #65c5b1;
  }
  50% {
    background-color: transparent;
    color: #184172;
  }
}
</style>
