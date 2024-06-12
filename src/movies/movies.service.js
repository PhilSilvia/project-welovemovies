const knex = require("../db/connection");

function list(){
    return knex("movies").select("*");
}

function listShowing(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .where({ "mt.is_showing": true })
        .distinctOn("m.movie_id")
        .select("m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url")
        .orderBy("m.movie_id");
}

module.exports = {
    list,
    listShowing,
};