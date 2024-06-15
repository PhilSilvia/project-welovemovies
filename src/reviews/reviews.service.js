// Database services for the /reviews path

const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");

// Helper function to add the critic properties as part of a nested object in the returned data
const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

// Returns the values from the table for a given review Id
function read(reviewId){
    return knex("reviews")
        .select("*")
        .where({ "review_id": reviewId })
        .first();
}

// Updates the values for a review with the given values and returns the updated review
function update(updatedReview) {
    return knex("reviews")
        .select("*")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*")
        .then((updated) => updated[0]);
}

// Returns the values for the review with the given id and its associated critic's values as well
function readWithCritic(reviewId){
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({ "review_id": reviewId })
        .select("r.*", "c.*")
        .first()
        .then(addCritic);
}

// Deletes the review with the given id
function destroy(reviewId){
    return knex("reviews").where({ "review_id": reviewId }).del();
}

module.exports = {
    read,
    readWithCritic,
    update,
    destroy,
};