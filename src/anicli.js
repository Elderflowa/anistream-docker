const agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0";
const allanimeRefr = "https://allmanga.to";
const allanimeBase = "allanime.day";
const allanimeApi = `https://api.${allanimeBase}`;

// ========== SEARCH ANIME ==========
async function searchAnime(query) {
  const searchGql = `
    query($search: SearchInput, $limit: Int, $page: Int, $translationType: VaildTranslationTypeEnumType, $countryOrigin: VaildCountryOriginEnumType) {
      shows(search: $search, limit: $limit, page: $page, translationType: $translationType, countryOrigin: $countryOrigin) {
        edges {
          _id
          aniListId
          name
        }
      }
    }
  `;

  const variables = {
    search: { allowAdult: false, allowUnknown: false, query },
    limit: 40,
    page: 1,
    translationType: "sub",
    countryOrigin: "ALL",
  };

  const url = new URL(`${allanimeApi}/api`);
  url.searchParams.append("variables", JSON.stringify(variables));
  url.searchParams.append("query", searchGql);

  const res = await fetch(url, {
    headers: { Referer: allanimeRefr, "User-Agent": agent },
  });

  if (!res.ok) return [];
  const data = await res.json();
  const shows = data?.data?.shows?.edges ?? [];

  return shows.map((show) => ({
    id: show._id,
    anilistId: show.aniListId,
    name: show.name,
  }));
}

// ========== GET ANIME BY ANILIST ID ==========
async function getAnimeByAnilistId(anilistId, title) {
  title = title.replace(/[!?\.]/g, "");
  const results = await searchAnime(title);
  return results.find((anime) => anime.anilistId == anilistId) || null;
}

// ========== GET EPISODES LIST ==========
async function getEpisodesList(showId) {
  const episodesListGql = `
    query ($showId: String!) {
      show(_id: $showId) {
        _id
        availableEpisodesDetail
      }
    }
  `;

  const variables = { showId };

  const url = new URL(`${allanimeApi}/api`);
  url.searchParams.append("variables", JSON.stringify(variables));
  url.searchParams.append("query", episodesListGql);

  const res = await fetch(url, {
    headers: { Referer: allanimeRefr, "User-Agent": agent },
  });

  if (!res.ok) return [];
  const data = await res.json();

  const episodes = data?.data?.show?.availableEpisodesDetail?.sub ?? [];
  return episodes;
}

// ========== DECODE PROVIDER ID ==========
function decodeProviderId(encoded) {
  const decodeMap = {
    79: "A",
    "7a": "B",
    "7b": "C",
    "7c": "D",
    "7d": "E",
    "7e": "F",
    "7f": "G",
    70: "H",
    71: "I",
    72: "J",
    73: "K",
    74: "L",
    75: "M",
    76: "N",
    77: "O",
    68: "P",
    69: "Q",
    "6a": "R",
    "6b": "S",
    "6c": "T",
    "6d": "U",
    "6e": "V",
    "6f": "W",
    60: "X",
    61: "Y",
    62: "Z",
    59: "a",
    "5a": "b",
    "5b": "c",
    "5c": "d",
    "5d": "e",
    "5e": "f",
    "5f": "g",
    50: "h",
    51: "i",
    52: "j",
    53: "k",
    54: "l",
    55: "m",
    56: "n",
    57: "o",
    48: "p",
    49: "q",
    "4a": "r",
    "4b": "s",
    "4c": "t",
    "4d": "u",
    "4e": "v",
    "4f": "w",
    40: "x",
    41: "y",
    42: "z",
    "08": "0",
    "09": "1",
    "0a": "2",
    "0b": "3",
    "0c": "4",
    "0d": "5",
    "0e": "6",
    "0f": "7",
    "00": "8",
    "01": "9",
    15: "-",
    16: ".",
    67: "_",
    46: "~",
    "02": ":",
    17: "/",
    "07": "?",
    "1b": "#",
    63: "[",
    65: "]",
    78: "@",
    19: "!",
    "1c": "$",
    "1e": "&",
    10: "(",
    11: ")",
    12: "*",
    13: "+",
    14: ",",
    "03": ";",
    "05": "=",
    "1d": "%",
  };

  let result = "";
  for (let i = 0; i < encoded.length; i += 2) {
    const hex = encoded.substring(i, i + 2);
    result += decodeMap[hex] || "";
  }
  return result.replace("/clock", "/clock.json");
}

// ========== GET EMBED URLS ==========
async function getEmbedUrls(showId, episodeString) {
  const episodeEmbedGql = `
    query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
      episode(showId: $showId, translationType: $translationType, episodeString: $episodeString) {
        episodeString
        sourceUrls
      }
    }
  `;

  const variables = {
    showId,
    translationType: "sub",
    episodeString,
  };

  const url = new URL(`${allanimeApi}/api`);
  url.searchParams.append("variables", JSON.stringify(variables));
  url.searchParams.append("query", episodeEmbedGql);

  const res = await fetch(url, {
    headers: { Referer: allanimeRefr, "User-Agent": agent },
  });

  if (!res.ok) return {};
  const data = await res.json();
  const sourceUrls = data?.data?.episode?.sourceUrls ?? [];

  const providers = {};
  for (const source of sourceUrls) {
    const name = source.sourceName;
    const url = source.sourceUrl;
    if (name && url && url.startsWith("--")) {
      providers[name] = url.substring(2);
    }
  }
  return providers;
}

// ========== GET VIDEO LINKS FROM PROVIDER ==========
async function getLinks(providerId) {
  let decoded = decodeProviderId(providerId);
  decoded = decoded.replace("https://", "/");
  const fullUrl = `https://${allanimeBase}${decoded}`;

  const res = await fetch(fullUrl, {
    headers: { Referer: allanimeRefr, "User-Agent": agent },
  });

  if (!res.ok) return [];
  const body = await res.text();

  try {
    const data = JSON.parse(body);
    const linksList = data.links ?? [];
    const links = [];

    for (const link of linksList) {
      const url = link.link;
      const quality = link.resolutionStr;
      if (!url || !quality) continue;

      let source = "Unknown";
      if (link.hls) source = "hls";
      else if (link.mp4) source = "mp4";
      else if (link.mkv) source = "mkv";
      else if (link.webm) source = "webm";

      const subtitles = link.subtitles?.[0]?.src ?? "";

      const headers = link.headers ?? {};
      links.push({
        url,
        quality,
        source,
        subtitles,
        referrer: headers.Referer || allanimeRefr,
        "user-agent": headers["user-agent"] || agent,
      });
    }
    return links;
  } catch (err) {
    console.error("[DEBUG] Failed to parse provider JSON:", err);
    return [];
  }
}

// ========== MAIN: GET EPISODE STREAM LINKS ==========
async function getEpisodeUrls(showId, episodeNumber) {
  const embedUrls = await getEmbedUrls(showId, episodeNumber);
  if (!embedUrls || Object.keys(embedUrls).length === 0) return null;

  const providerOrder = ["Luf-Mp4", "Default", "Yt-mp4", "S-mp4"];
  const allLinks = [];

  for (const provider of providerOrder) {
    const providerId = embedUrls[provider];
    if (!providerId) continue;

    const links = await getLinks(providerId);
    if (links.length > 0) allLinks.push(...links);
  }

  return allLinks;
}

module.exports = {
  searchAnime,
  getAnimeByAnilistId,
  getEpisodesList,
  getEpisodeUrls,
};
