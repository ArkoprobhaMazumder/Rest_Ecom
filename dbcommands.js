db.products.aggregate([
    {
        $unwind: "$ratings"
    },

    {
        $group:
        {
            _id: "$name",
            avaRating: { $avg: "$ratings.rating" }
        }
    }
])

db.products.aggregate([
    // stage1: project the data
    {
        $project: {
            name: 1,
            rateCount: {
                $cond: { if: { isArray: "$ratings" }, then: { $size: "$ratings" }, else: 0 }
            }
        }
    },
    // stage2: sort the data
    {
        $sort: { rateCount: -1 }
    },
    {
        $limit: 1
    }
])