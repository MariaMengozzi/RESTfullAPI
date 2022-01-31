const mongoose = require('mongoose');

const StationsSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: { 
          type: [Number], //[longitude, latitude]
          required: true
        }
      }

});

StationsSchema.index({ location: "2dsphere" })

module.exports = mongoose.model('Stations', StationsSchema);

/* 
station_id = ndb.StringProperty()
    station_name = ndb.StringProperty()
    description = ndb.TextProperty()
    owner_id = ndb.StringProperty()
    location_name = ndb.StringProperty()
    state = ndb.BooleanProperty(default=False)
    image_filename = ndb.StringProperty()
    image_mimetype = ndb.StringProperty()
    coordinates = ndb.GeoPtProperty() # input float
    svo_url = ndb.StringProperty()
    boa_url = ndb.StringProperty()
    svo_key = ndb.StringProperty()
    #latitude = ndb.FloatProperty()
    #longitude = ndb.FloatProperty()
    timestamp = ndb.FloatProperty()
    timezone = ndb.IntegerProperty()
    #----
    configurated = ndb.BooleanProperty(default=False)
    is_trained = ndb.BooleanProperty(default=False)
*/