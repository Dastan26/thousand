<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const media = ref({});
const baseImageUrl = "https://image.tmdb.org/t/p/w500";

const getImageUrl = (path) => {
  return path ? `${baseImageUrl}${path}` : "";
};

const getReleaseYear = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
  }
  return "";
};

const formatGenres = (genres) => {
  if (typeof genres === "object") {
    return Object.values(genres)
      .map((genre) => genre.name)
      .join(", ");
  }
  return "";
};

const route = useRoute();

async function fetchMediaDetails(mediaId, mediaType) {
  try {
    const apiKey = "ec72b3f27c67f168bb4a09806137d4d7";
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}&language=ru-RU`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching media details:", error);
    return null;
  }
}

const getBackgroundImage = () => {
  const backdropPath = media.value.backdrop_path;
  return backdropPath ? `url(${baseImageUrl}${backdropPath})` : "";
};

onMounted(async () => {
  const mediaId = route.params.id;
  const mediaType = route.query.mediaType;

  const mediaDetails = await fetchMediaDetails(mediaId, mediaType);
  if (mediaDetails) {
    media.value = mediaDetails;
  }
});
</script>

<template>
  <div class="container">
    <div
      class="media-wrapper"
      :style="{ backgroundImage: getBackgroundImage() }"
    >
      <div class="media-detail">
        <img
          class="media-img"
          :src="getImageUrl(media.poster_path)"
          alt="Media Poster"
        />
        <div class="media-info">
          <h1>
            {{ media.title || media.name }} ({{
              getReleaseYear(media.release_date)
            }})
          </h1>
          <div class="genres">
            <span>{{ formatGenres(media.genres) }}</span>
            <span>{{ media.runtime }}m</span>
          </div>
          <div class="vote-wrapper">
            <p class="vote">{{ media.vote_average }}</p>
            <span>Пользовательский счет</span>
          </div>
          <p style="font-style: italic">{{ media.tagline }}</p>
          <h3>Обзор</h3>
          <p>{{ media.overview }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.media-wrapper {
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0 auto;
  max-width: 50%;
  color: white;
}
.media-detail {
  display: flex;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 50%);
  padding: 25px;
}

.media-img {
  max-width: 250px;
}

.media-info {
  display: flex;
  flex-direction: column;
  text-align: start;
  margin-left: 25px;
  gap: 20px;
}

.title {
  display: flex;
  align-items: center;
}

.title-year {
  font-size: 30px;
}
.vote-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
}

.vote {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 9px;
  border-radius: 8px;
  font-size: 16px;
}

.genres {
  display: flex;
  gap: 10px;
}
</style>
