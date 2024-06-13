const knex = require("../db/connection");

function list(){
    return knex("movies").select("*");
}

function listShowing(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .where({ "mt.is_showing": true })
        .distinctOn("m.movie_id")
        .select("*")
        .orderBy("m.movie_id");
}

function read(movieId){
    return knex("movies")
        .select("*")
        .where({ "movie_id": movieId })
        .first();
}

module.exports = {
    list,
    listShowing,
    read,
};