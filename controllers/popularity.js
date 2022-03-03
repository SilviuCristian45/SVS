async function updatePopularityRatings(contentModel){
    const ups = await contentModel.aggregate([{
        "$addFields": {
            "rating": {
              $sum: [
                "$likes",
                "$dislikes",
                "$views"
              ]
            }
        }
    }]).limit(5)

    return ups.sort( (a,b) => b.rating - a.rating)
}

module.exports = {
    updatePopularityRatings
}