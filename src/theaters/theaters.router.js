// Router for the /theaters route method

const router = require("express").Router({ mergeParams: true });
const controller = require("./theaters.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Define just the GET method for the base route
router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;