const { getEpisodesList, getAnimeByAnilistId } = require("./anicli");

const BASE_URL = "https://graphql.anilist.co";

async function fetchAnilist(query, variables) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });
  return response.json();
}

async function searchAnime(searchQuery, type) {
  const query = `
    query ($search: String!) {
      Page {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          format
        }
      }
    }`;
  const variables = { search: searchQuery };
  const data = await fetchAnilist(query, variables);
  return data.data.Page.media.map((anime) => ({
    id: "ani_" + anime.id.toString(),
    type: "series",
    name: anime.title.english || anime.title.romaji || anime.title.native,
    poster: anime.coverImage.large,
  }));
}

async function getAnimeDetails(animeId) {
  const query = `
    query ($id: Int!) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        bannerImage
        genres
        averageScore
        seasonYear
        format
        episodes
        description
        status
        nextAiringEpisode {
          episode
        }
      }
    }`;
  const variables = { id: parseInt(animeId.split("_")[1]) };
  const data = await fetchAnilist(query, variables);
  const anime = data.data.Media;

  var videos = [];
  const episodeCount =
    anime.episodes || anime.nextAiringEpisode.episode - 1 || 0;
  const cleanDescription = anime.description
    ? anime.description.replace(/<\/?[^>]+(>|$)/g, "")
    : "";
  const title = anime.title.english || anime.title.romaji || anime.title.native;

  for (var i = 0; i < episodeCount; i++) {
    videos.push({
      id: `ani_${anime.id}_${title.replace("?", "").replace("!", "")}_${i + 1}`,
      title: `Episode ${i + 1}`,
      episode: episodeCount - i + 1,
      type: "episode",
      available: true,
    });
  }
  return {
    id: "ani_" + anime.id.toString(),
    type: "series",
    name: title,
    genres: anime.genres,
    poster: anime.coverImage.large,
    background: anime.bannerImage,
    description: cleanDescription,
    releaseInfo: anime.seasonYear,
    imdbRating: anime.averageScore,
    videos: videos,
  };
}

module.exports = { searchAnime, getAnimeDetails };
