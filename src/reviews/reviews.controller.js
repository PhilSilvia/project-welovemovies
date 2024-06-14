const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

async function reviewExists(req, res, next){
    const { reviewId } = req.params;
    const review = await service.read(reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }
    next({ status: 404, message: "Review cannot be found"});
}

async function destroy(req, res, next){
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
}

async function update(req, res, next){
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await service.update(updatedReview);
    const data = await service.readWithCritic(updatedReview.review_id);
    res.json({ data });
}

module.exports = {
    delete: [ asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy) ],
    update: [ asyncErrorBoundary(reviewExists), asyncErrorBoundary(update) ],
};