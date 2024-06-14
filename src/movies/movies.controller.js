const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

async function list(req, res, next){
    const { is_showing } = req.query;
    let data = {};
    if (is_showing){
        data = await service.listShowing();
    } else {
        data = await service.list();
    }
    res.json({ data: data });
}

async function movieExists(req, res, next){
    const { movieId } = req.params;
    const movie = await service.read(movieId);
    if (movie){
        res.locals.movie = movie;
        return next();
    }
    next({ status: 404, message: "Movie cannot be found"});
}

function read(req, res, next){
    res.json({ data: res.locals.movie });
}

async function listReviews(req, res, next){
    const { movieId } = req.params;
    const data = await service.listReviews(movieId);
    res.json({ data });
}

async function listTheaters(req, res, next){
    const { movieId } = req.params;
    const data = await service.listTheaters(movieId);
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [ asyncErrorBoundary(movieExists), read ],
    listTheaters: [ asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters) ],
    listReviews: [ asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews) ],
};