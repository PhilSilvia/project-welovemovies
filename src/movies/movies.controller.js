// Controller to handle the methods for the /movies route

const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

// Sends the full details on all movies to the user, or just the movies that are currently showing,
// based on the is_showing route query
async function list(req, res, next){
    // Retrieves the is_showing query
    const { is_showing } = req.query;
    // Initializes our returned data
    let data = {};
    // If we want to only send the currently showing movies, we use the appropriate service method
    if (is_showing){
        data = await service.listShowing();
    } 
    // Otherwise, we ask the service for all of the movies
    else {
        data = await service.list();
    }
    // Return the desired movie details to the user
    res.json({ data: data });
}

// Middleware function to check and see if a movie exists for a given id
async function movieExists(req, res, next){
    // Retrieve the movie id from the route parameters
    const { movieId } = req.params;
    // Get the movie details from the service for the given id
    const movie = await service.read(movieId);
    // If we found a movie, store it in the locals and move on
    if (movie){
        res.locals.movie = movie;
        return next();
    }
    // Otherwise we send an error message to the user
    next({ status: 404, message: "Movie cannot be found"});
}

// Gives the details for a movie with a given id
function read(req, res, next){
    // Sends the movie details found by the middleware function to the user
    res.json({ data: res.locals.movie });
}

// Sends the reviews associated with the given movie id to the user
async function listReviews(req, res, next){
    // Retrieve the movie id from the route parameters
    const { movieId } = req.params;
    // Request the review details from the service
    const data = await service.listReviews(movieId);
    // Send the data back to the user
    res.json({ data });
}

// Sends the theaters currently showing the given movie to the user
async function listTheaters(req, res, next){
    // Retrieve the movie id from the route parameters
    const { movieId } = req.params;
    // Request the theater details from the service
    const data = await service.listTheaters(movieId);
    // Send the data back to the user
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [ asyncErrorBoundary(movieExists), read ],
    listTheaters: [ asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters) ],
    listReviews: [ asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews) ],
};