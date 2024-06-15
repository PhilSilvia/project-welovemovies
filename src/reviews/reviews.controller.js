// Controller to handle the methods for the /reviews route

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

// Middleware function that ensures a review exists for a given id
async function reviewExists(req, res, next){
    // Retrieve the id from the route parameters
    const { reviewId } = req.params;
    // Access the review from the database service
    const review = await service.read(reviewId);
    // If we found the review, store it in the locals and continue
    if (review) {
        res.locals.review = review;
        return next();
    }
    // Otherwise, return an error message to the user
    next({ status: 404, message: "Review cannot be found"});
}

// Deletes the review matching the given id
async function destroy(req, res, next){
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
}

// Updates the review at the given id with the new values sent in the request body
async function update(req, res, next){
    // Create the updated review with the new values
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    // Use the service to update the review and await its response
    await service.update(updatedReview);
    // Store the review with the critic information
    const data = await service.readWithCritic(updatedReview.review_id);
    // Send the review and critic details back to the user
    res.json({ data });
}

module.exports = {
    delete: [ asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy) ],
    update: [ asyncErrorBoundary(reviewExists), asyncErrorBoundary(update) ],
};