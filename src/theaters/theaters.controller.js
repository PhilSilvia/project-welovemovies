// Controller to handle the methods for the /movies route

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./theaters.service");

// Sends the details for all theaters, including a list of the movies
// they are currently showing
async function list(req, res, next){
    // Retrieve the details from the service
    const data = await service.list();
    // Send them to the user
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
};