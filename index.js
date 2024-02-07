import express from "express";
import axios from "axios";

const port = 3000;
const app = express();
const API_URL = "https://api.jikan.moe/v4"

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

app.post ("/anime-search", async (req, res) => {
    const animeInput = req.body.anime;
    const animeId = [];
    const animeTitle = [];
    const animeImg = [];
    const animeSinop = [];
    
    const animeResult = await axios.get(API_URL + "/anime?q='" + animeInput +"'");
    animeResult.data.data.forEach(anime => {
        animeId.push(anime.mal_id);
        animeTitle.push(anime.title);
        animeImg.push(anime.images.jpg.image_url)
    });
    res.render("search-anime.ejs", {
        animeId: animeId,
        animeTitle: animeTitle,
        animeImg: animeImg
    });
})

app.listen(port, ()=>{
    console.log("App using port " + port)
})