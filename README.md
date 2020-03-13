Location Server
==================

Location Server provide APIs to store and fetch location data in Redis.

Introduction
------------

Location service requires to store the location of the users frequently as well as fetch a location or multiple locations stored in a database. Redis is used to support frequent update of user locations due to its speed, and geospatial data support.
 

APIs
--------

### 1. Store a location of a user.
```text
POST /locations
```
Body
```text
{
  "userId": [string],
  "longitude": [float],
  "latitude": [float]
}
```

### 2. Get a location of a user.
```text
GET /locations/:userId
```

### 3. Get the locations within given geolocation and radius.
```text
GET /locations?longitude=[float]&latitude=[float]&radius=[number]&unit=['m'|'km'|'mi'|'ft']
```
