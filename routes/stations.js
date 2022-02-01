const express = require('express');
const router = express.Router();
const Station = require("../models/Station");

router.get("/getAll", async (req, res)=> {
    // #swagger.tags = ['Station']
    // #swagger.description = 'Endpoint to get all stations'

    //get all stations
    try{
        const stations = await Station.find();
         /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Station" },
               description: 'all stations.' 
        } */
        res.json(stations);
    } catch (err) {
        res.json({error: err});
    }
});

router.post("/insert", async (req, res)=> {
    // #swagger.tags = ['Station']
    // #swagger.description = 'Endpoint to insert a station'
    /* #swagger.parameters['newStation'] = {
               in: 'body',
               description: 'Information about the station',
               required: true,
               schema: { $ref: "#/definitions/Station" }
        } */
    //insert a station
    
    try{
        console.log(req.body)
        const station = new Station({
            name: req.body.name,
            location: req.body.location
        });
        const savedStation = await station.save();
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Station" },
               description: 'insered station.' 
        } */
        res.json(savedStation);

    } catch (err) {
        res.json({error: err});
    }
});

router.get("/getNearStaions/:longitude/:latitude", async (req, res) => {
    // #swagger.tags = ['Station']
    // #swagger.description = 'Endpoint to get all stations in a round of 5000m to the center'
    // #swagger.parameters['longitude'] = { description: 'center longitude' }
    // #swagger.parameters['latitude'] = { description: 'center latitude' }
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
         /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Station" },
               description: 'near station.' 
        } */
        res.status(200).json(stations);
    } catch (error) {
        res.json({message:error});
    }
    
});


router.patch('/:stationId', async (req, res) => {
    // #swagger.tags = ['Station']
    // #swagger.description = 'Endpoint to update a specific station'
    // #swagger.parameters['stationId'] = { description: 'ID of a station' }
    /* #swagger.parameters['updatedStation'] = {
               in: 'body',
               description: 'Information about the station',
               required: true,
               schema: { $ref: "#/definitions/Station" }
        } */
    try {
        const updatedStation = await Station.updateOne(
            {_id:req.params.stationId},
            {$set:{
                name: req.body.name,
                location: req.body.location
            }}
        );
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Station" },
               description: 'a specific station.' 
        } */
        res.status(200).json(updatedPost);
    } catch (error) {
        res.json({message:error})
    }
});

module.exports = router;