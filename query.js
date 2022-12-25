db.intArray.insertMany([
    {
        id: 1,
        "intArray": [1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
        id: 2,
        "intArray": [8, 2, 3, 5, 7, 2, 5, 2]
    }
])



//use of $cond and array filters



db.intArray.updateMany({}, {
    $set: {
        "newArray.$[el]": 10
    }
}, {
    arrayFilters: [
        {
            "el": {
                $gte: 8
            }
        }
    ]
})


db.intArray.aggregate([
    {
        $project: {
            intArray: {
                $map: {
                    input: "$intArray",
                    as: "el",
                    in: {
                        $cond: [{ $gte: ["$$el", 8] }, 10, "$$el"]
                    }
                }
            }
        }
    }
]).pretty()


//make all the 2 in the 2nd item into 9


db.intArray.updateMany({
    id: 2
},
    {
        $set: {
            "intArray.$[el]": 9
        }
    },

    {
        arrayFilters: [{ "el": 2 }]
    }
)




//find the element which the the most number of 2 in its intArray

db.intArray.aggregate([
    {
        $unwind: "$intArray"
    },
    {
        $match: {
            intArray: 2
        }
    },
    {
        $group: {
            "_id": "$id",
            "count": { $sum: 1 },
        }
    },
    {
        $sort: {
            count: -1
        }
    },
    {
        $limit: 1
    }

]).pretty()




//count all the "2"s in the intArray

db.intArray.aggregate([
    {
        $unwind: "$intArray"
    },
    {
        $match: {
            intArray: 2
        }
    },
    {
        $group: {
            "_id": "$intArray",
            "count": { $sum: 1 }
        }
    }
]).pretty()

//count all the "2"s in the intArray of the  document with the id of 2

db.intArray.aggregate([
    {
        $match: {
            id: 2
        }
    },
    {
        $unwind: "$intArray"
    },
    {
        $match: {
            intArray: 2
        }
    },
    {
        $group: {
            "_id": "$intArray",
            "count": { $sum: 1 }
        }
    }
]).pretty()


//filter
db.intArray.aggregate([
    {
        $project: {
            newArray: {
                $filter: {
                    input: "$intArray",
                    as: "el",
                    cond: { $gte: ["$$el", 3] },
                }
            }
        }
    }
]).pretty()

//array map
db.intArray.aggregate([
    {
        $project: {
            newArray: {
                $map: {
                    input: "$intArray",
                    as: "el",
                    in: { $add: ["$$el", 3] },
                }
            }
        }
    }
]).pretty()


db.intArray.updateMany({
    $expr: {
        $eq: [{ $arrayElemAt: ["$intArray", 0] }, 1]
    }
}, [
    {
        $set: {
            newArray: {
                $filter: {
                    input: "$intArray",
                    as: "el",
                    cond: { $lte: ["$$el", 3] },
                }
            }
        }
    }
])

db.intArray.find({
    $expr: {
        $eq: [{ $arrayElemAt: ["$intArray", 0] }, 1]
    }
}).pretty()

db.intArray.aggregate({
    $project: {
        intArray: {
            $arrayElemAt: ["$intArray", 0]
        }
    }
}).pretty()



//discounts


[
    {
        "_id": ObjectId("63948da1a6e0456e9ec00304"),
        "discount": [
            " 20% off"
        ],
        "num": 20
    },
    {
        "_id": ObjectId("63948da1a6e0456e9ec00305"),
        "discount": [
            " 30% off"
        ],
        "num": 30
    },
    {
        "_id": ObjectId("63948da1a6e0456e9ec00306"),
        "discount": [
            "40% off"
        ],
        "num": 40
    }
]


db.discounts.aggregate([
    {
        $project: {
            discount: {
                $toInt: {
                    $arrayElemAt: [
                        {
                            $split: [
                                {
                                    $trim: {
                                        input: {
                                            $arrayElemAt: ["$discount", -1]
                                        }
                                    }
                                }
                                , "%"
                            ]
                        },
                        0
                    ]
                }
            }
        }
    }
]).pretty()


db.discounts.updateMany({}, [
    {
        $set: {
            discount: {
                $toInt: {
                    $arrayElemAt: [
                        {
                            $split: [
                                {
                                    $trim: {
                                        input: {
                                            $arrayElemAt: ["$discount", -1]
                                        }
                                    }
                                }
                                , "%"
                            ]
                        },
                        0
                    ]
                }
            }
        }
    }
])




