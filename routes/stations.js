const express = require('express');
const router = express.Router();
const Station = require("../models/Station");

router.get("/", async (req, res)=> {
    //get all stations
    try{
        const stations = await Station.find();
        res.json(stations);
    } catch (err) {
        res.json({error: err});
    }
});

router.post("/", async (req, res)=> {
    //insert a station
    
    try{
        console.log(req.body)
        const station = new Station({
            name: req.body.name,
            location: req.body.location
        });
        const savedStation = await station.save();
        res.json(savedStation);

    } catch (err) {
        res.json({error: err});
    }
});

router.get("/getNearStaions/:longitude/:latitude", async (req, res) => {
// get all station in a round of max 5000 m
    try {
        const stations = await Station.aggregate([
            {
              $geoNear: {
                 near: { type: "Point", coordinates: [ Number(req.params.longitude) , Number(req.params.latitude) ] },
                 distanceField: "dist.calculated",
                 maxDistance: 5000,
                 includeLocs: "dist.location",
                 spherical: true
              }
            }
         ])
            

            /* {
                location:
                  { $near:
                     {
                       $geometry: { type: "Point",  
                                    coordinates: [ -73.9667, 40.78 ] 
                                },
                       $minDistance: 0,
                       $maxDistance: 1000
                     }
                  }
              } */
        console.log(stations)
        res.status(200).json(stations);
    } catch (error) {
        res.json({message:error});
    }
    
});


router.patch('/:stationId', async (req, res) => {
    try {
        const updatedStation = await Station.updateOne(
            {_id:req.params.stationId},
            {$set:{
                name: req.body.name,
                location: req.body.location
            }}
            );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.json({message:error})
    }
});

module.exports = router;