// Database services for the /theaters route

const knex = require("../db/connection");

// Helper function that will build an array with the movie details for
// a theater after it's been retrieved from the database
const reduceProperties = require("../utils/reduce-properties");
const addMovies = reduceProperties("theater_id", 
    {
        movie_id: ["movies", null, "movie_id"],
        title: ["movies", null, "title"],
        runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
        rating: ["movies", null, "rating"],
        description: ["movies", null, "description"],
        image_url: ["movies", null, "image_url"],
        is_showing: ["movies", null, "is_showing"]
    }
);

// Returns the full details for all theaters in the database.
// Also joins the movie details for any movies that the theater
// is currently showing. 
function list(){
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("t.*", "m.*", "mt.*")
        .then(addMovies);
}

module.exports = {
    list,
};