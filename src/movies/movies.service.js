const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
});

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

function listReviews(movieId){
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movieId })
        .then((data) => data.map(addCritic));
}

function listTheaters(movieId){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*", "m.movie_id", "mt.is_showing")
        .where({ "m.movie_id": movieId });
}

module.exports = {
    list,
    listShowing,
    read,
    listReviews,
    listTheaters,
};