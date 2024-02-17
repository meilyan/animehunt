import express from "express";
import axios from "axios";
import Bottleneck from "bottleneck";

const port = 3000;
const app = express();
const API_URL = "https://api.jikan.moe/v4"

const apiClient = axios.create({
    baseURL:API_URL
})

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 2000,
})

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get ("/", async (req, res) => {
    const animeTopResult = await axios.get(API_URL + "/top/anime?type=tv&filter=bypopularity");
    const animeTopAiringResult = await axios.get(API_URL + "/top/anime?type=tv&limit=6&filter=airing");
    const animeTopUpCommingResult = await axios.get(API_URL + "/top/anime?type=tv&limit=6&filter=upcoming");
    
    const topAnimeData = {
        topMalId : [],
        topImages : [],
        topTitle : [],
        topType : [],
        topStatus : [],
        topSeason : [],
        topYear : [],
        topScore : [],
        topMembers: [],
        topDuration: [],
        topGenre : [],
    }

    const topAiringMalId = [];
    const topAiringImages = [];
    const topAiringTite = [];

    const topUpCommingMalId = [];
    const topUpCommingImages = [];
    const topUpCommingTitle = [];

    animeTopResult.data.data.forEach(anime => {
        topAnimeData.topMalId.push(anime.mal_id)
        topAnimeData.topImages.push(anime.images.jpg.image_url)
        topAnimeData.topTitle.push(anime.title)
        topAnimeData.topType.push(anime.type)
        topAnimeData.topStatus.push(anime.status)
        topAnimeData.topSeason.push(anime.season)
        topAnimeData.topYear.push(anime.year)
        topAnimeData.topScore.push(anime.score)
        topAnimeData.topMembers.push(anime.members)
        topAnimeData.topDuration.push(anime.duration)
        
        const genreNames = anime.genres.map(genre => genre.name);
        topAnimeData.topGenre.push(genreNames)
    });

    animeTopAiringResult.data.data.forEach(anime => {
        topAiringMalId.push(anime.mal_id)
        topAiringImages.push(anime.images.jpg.image_url)
        topAiringTite.push(anime.title)
    });

    animeTopUpCommingResult.data.data.forEach(anime => {
        topUpCommingMalId.push(anime.mal_id)
        topUpCommingImages.push(anime.images.jpg.image_url)
        topUpCommingTitle.push(anime.title)
    });

    res.render("index.ejs", {
        topAnimeData,
        
        idA: topAiringMalId,
        imgA: topAiringImages,
        titleA: topAiringTite,

        idU: topUpCommingMalId,
        imgU: topUpCommingImages,
        titleU: topUpCommingTitle
    });
})

app.get ("/search", async (req, res) => {
    res.render("search.ejs")
})

app.post ("/search-anime", async (req, res) => {
    const animeInput = req.body.anime;
    const animeData = {
        animeId : [],
        animeTitle : [],
        animeImg : [],
    }

    const animeResult = await axios.get(API_URL + "/anime?q='" + animeInput + "'");
    animeResult.data.data.forEach(anime => {
        animeData.animeId.push(anime.mal_id);
        animeData.animeTitle.push(anime.title);
        animeData.animeImg.push(anime.images.jpg.image_url);
    })

    res.render("search-anime.ejs", {
        animeData, animeInput
    });
})

app.get("/anime/:id/:title", async (req,res) => {
    const animeResult = await limiter.schedule(() => apiClient.get(`/anime/${req.params.id}/full`)) 
    const imageResult = await limiter.schedule(() => apiClient.get(`/anime/${req.params.id}/pictures`));
    const characterResult = await limiter.schedule(() => apiClient.get(`/anime/${req.params.id}/characters`));
    const staffResult = await limiter.schedule(() => apiClient.get(`/anime/${req.params.id}/staff`));

    const characterData = {
        charId: [],
        images: [],
        name: [],
    }
    const voiceActorData = {
        voiceId: [],
        images: [],
        name: []
    }

    const staffData = {
        staffId: [],
        images: [],
        name: []
    }

    characterResult.data.data.map(char => char.character).forEach(character => {
        characterData.charId.push(character.mal_id);
        characterData.images.push(character.images.jpg.image_url);
        characterData.name.push(character.name)
    })

    characterResult.data.data.forEach(character => {
        if (character.voice_actors.length > 0) {
          const firstVoiceActorName = character.voice_actors[0].person.name;
          const firstVoiceActorImage = character.voice_actors[0].person.images.jpg.image_url;
          voiceActorData.name.push(firstVoiceActorName)
          voiceActorData.images.push(firstVoiceActorImage)
        }
      });

      staffResult.data.data.map(staff => staff.person).forEach(person => {
        staffData.staffId.push(person.mal_id);
        staffData.images.push(person.images.jpg.image_url);
        staffData.name.push(person.name)
      });

    res.render("anime.ejs", {
        animeData : animeResult.data.data, 
        imageData : imageResult.data.data[Math.floor(Math.random()*imageResult.data.data.length)], 
        character: characterData,
        voiceActor: voiceActorData,
        staff: staffData
    })
})

app.listen(port, ()=>{
    console.log("App using port " + port)
})