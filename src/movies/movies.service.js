// Database service for the /movies route

const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");
// Helper function that puts all of the critic details into their own nested object
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
});

// Returns the full details for all movies in the database
function list(){
    return knex("movies").select("*");
}

// Returns the full details for only movies that are currently being shown in any theater
function listShowing(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select(
            "m.movie_id", 
            "m.title", 
            "m.runtime_in_minutes", 
            "m.rating", 
            "m.description",
            "m.image_url"
        )
        .where({ "mt.is_showing": true })
        .distinct()
        .orderBy("m.movie_id");
}

// Returns the details for the movie that matches the given id
function read(movieId){
    return knex("movies")
        .select("*")
        .where({ "movie_id": movieId })
        .first();
}

// Returns the details to all reviews for the movie with the given id,
// including the details for the critics who wrote the associated reviews
function listReviews(movieId){
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movieId })
        .then((data) => data.map(addCritic));
}

// Returns the details for the theaters that show the movie with the given id
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