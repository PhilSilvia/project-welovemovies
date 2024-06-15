// Router for the /movies route

const router = require("express").Router({ mergeParams: true });
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Defines only the get method for the base route
router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);
// Defines the get method for the /:movieId route 
router.route("/:movieId")
    .get(controller.read)
    .all(methodNotAllowed);
// Defines the get method for the /:movieId/reviews
router.route("/:movieId/reviews")
    .get(controller.listReviews)
    .all(methodNotAllowed);
// Defines the get method for the /:movieId/theaters
router.route("/:movieId/theaters")
    .get(controller.listTheaters)
    .all(methodNotAllowed);

module.exports = router;