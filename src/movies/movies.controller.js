const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next){
    const data = await service.list();
    res.json({ data: data });
}

function read(req, res, next){

}

module.exports = {
    list: asyncErrorBoundary(list),
    read,
};