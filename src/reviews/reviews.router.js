// Router for the /reviews route

const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// No methods for the base route
router.route("/")
    .all(methodNotAllowed);

// Support for the DELETE and PUT http mtheods
router.route("/:reviewId")
    .delete(controller.delete)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;