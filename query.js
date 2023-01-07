[
    {
        name: "California Academy of Sciences",
        location: {
            type: "Point",
            coordinates: [-122.4724356, 37.7672544] //longitude, latitude
        }
    },
    {
        name: "Conservatory of flowers ",
        location: {
            type: "Point",
            coordinates: [-122.4615748, 37.7701756] //longitude, latitude
        }
    },
    {
        name: "Golden gate Tennis Park",
        location: {
            type: "Point",
            coordinates: [-122.4593702, 37.7705046] //longitude, latitude
        }
    },
    {
        name: "Nopa",
        location: {
            type: "Point",
            coordinates: [-122.4389058, 37.7747415] //longitude, latitude
        }
    },
]


db.places.insertMany([
    {
        name: "California Academy of Sciences",
        location: {
            type: "Point",
            coordinates: [-122.4724356, 37.7672544] //longitude, latitude
        }
    },
    {
        name: "Conservatory of flowers ",
        location: {
            type: "Point",
            coordinates: [-122.4615748, 37.7701756] //longitude, latitude
        }
    },
    {
        name: "Golden gate Tennis Park",
        location: {
            type: "Point",
            coordinates: [-122.4593702, 37.7705046] //longitude, latitude
        }
    },
    {
        name: "Nopa",
        location: {
            type: "Point",
            coordinates: [-122.4389058, 37.7747415] //longitude, latitude
        }
    },
])


//get all places

db.places.find().pretty()


//drop collection

db.places.drop()


//get places near my location


db.places.find({
    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-122.471114, 37.771104]
            },
            $maxDistance: 550, //in meters
            $minDistance: 10 //in meters
        }
    }
}).pretty()


db.places.createIndex({ location: "2dsphere" })


const p1 = [-122.4547, 37.77473]
const p2 = [-122.45303, 37.76641]
const p3 = [-122.51026, 37.76411]
const p4 = [-122.51088, 37.77131]

db.places.find({
    location: {
        $geoWithin: {
            $geometry: {
                type: "Polygon",
                coordinates: [[p1, p2, p3, p4, p1]]
            }
        }
    }
}).pretty()






























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




