---
layout: page
title: Rivet Content API
---
The Rivet Platform allows brands and retailers to collect a variety of engaging user generated content – including rich media (photos and videos), geolocation, and commentary – directly from their customers. Rivet offers a collection of embeddable JavaScript displays, called embeds, that allow brands and retailers to easily display the user generated content on their own websites using only a few lines of code. For those customers in search of a more custom display experience, we offer the Rivet Content API. Customers can use the API to create their own galleries of user generated content and integrate the content anywhere on their website.

The Content API returns user generated content based on an embed’s data and moderation configuration. Customers create and configure embeds using the Rivet Administrative Interface. The Content API also allows for filtering the results it returns based on tags and location data associated with the content.

## Calling the API

You call the API using the following endpoint. This example returns 24 pieces of content starting at the beginning of the results set.

`http://api.rivet.works/embedded/data/{embedIdentifier}`

The “embedIdentifier” at the end of the URL is the ID that the Rivet platform assigned to the embed. You can also define a unique embed key in the Rivet Administrative Interface and use that in the API call. The embed key allows for “friendlier” URL formats. Each embed key must be unique across the Rivet platform.

### Optional Query Parameters

|name    |description                                                                                                                                                             |default value|
|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
|limit   |Number of data items for the API to return.                                                                                                                             |24           |
|offset  |Index into the result set from which to start returning results.                                                                                                        |0            |
|q       |Qualifiers for filtering the results. See section “Filtering Results”.                                                                                                  |None         |
|callback|Support for JSONP. Passing a function name as the “callback” parameter to the API will return the result object wrapped with a JavaScript function call to the callback.|None         |
|i       |Tracking identifier that you define. This allows you to track user activity through our analytics.                                                                      |None         |
{:.table .table-responsive}

**Note:** The limit and offset parameters support paging through content.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}

### Filtering Results

The Content API allows you to filter results using tags and location data. Tags are assigned to content when users complete a Rivet activity. Also, moderators using the Rivet Administrative Interface can edit the tags for user activity submissions.  Location data is based on the geolocation information provided by the user or that an uploaded photo contains.

Rivet embeds use what is called a page context to tell the API how to filter results. The page context is a JSON object that specifies which tags and/or geolocation response content must match for the API to include them in the results. The page context supports a variety of logical expressions for customizing filtering criteria.

For more information about the page context see the section “Website Integration” in the “Rivet Technical Integration Guide.” 

Filtering with the Content API is very similar to the embed’s page context. The API calls its filtering parameter qualifier. Instead of being a JSON object as is the embed’s page context, the qualifier for the API is expressed as Rison. The API uses Rison because it is more compact than JSON and better suited for expressing a complex object as a query parameter.

**Note:** The Rison qualifier must be URL encoded.

The following is an example of a JSON page context and its corresponding Rison qualifier:

#### JSON

``` json
"pageContext": {
   "tags": {
    "city": ["Austin", "London"],
    "type": "day"
   },
   "geoRegion": {
    "lat": 40.833333333, 
    "lon": 14.25, 
    "r": "5 km"
  }
 }
 
```
#### Rison

`
(t:(city:!(Austin,London),type:day),g:(lat:40.833333333,lon:14.25,r:'5 km')
`

For more information about Rison please see https://github.com/Nanonid/rison

### Qualifier Keys

The qualifier supports two top-level keys for tags and geolocations. See the section “Website Integration” in the “Rivet Implementation Guide” for more information about the tags and geoRegion qualifiers.

| name | description                                                |
| ---- | ---------------------------------------------------------- |
| t    | Analogous to the tags key in an embed’s page context.      |
| g    | Analogous to the geoRegion key in an embed’s page context. |
| s    |                                                            |

**Note:** While the top-level Rison keys are shortened to make request URLs more compact, the keys of the tags and geoRegion objects are not shortened.

### Examples
Below are examples of calls to the API. The qualifier parameters in the examples are not URL encoded for ease of reading. In production use, the qualifier should be URL encoded.

#### Loading the first “page” of content with 24 pieces of content per page:
```
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=0
```

#### Loading the second page of content.
Notice that the limit is added to the offset for each page.
```
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=24
```

#### Calling the API with a JSONP callback function.
This is how Rivet’s embeds most often uses the API. This example results in a call to the window.dataLoaded function with the response from the API as the only parameter. It is up to you to write the callback function.
``` 
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=24&callback=window.dataLoaded
```

#### Using the API with a filter for responses tagged with a SKU of M1234/LL.
``` 
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=24&q=(t:(sku:M1234/LL))
```

#### Tracking your user using the tracking identifier.
``` 
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=24&i=192837
```

#### Getting responses within a 5 mile radius of a location tagged with summer.

``` 
http://api.rivet.works/embedded/data/{embedIdentifier}?limit=24&offset=24&i=192837&q=(g:(lat:40.833333333,lon:14.25,r:'5 mi'),t:(season:summer))
```

### Sorting Results

## Responses from the API

The response from the API is a JSON object. Below is an example of a response from the API.

``` json
{
  "success": true,
  "totalResults": 2,
  "data": [
    {
      "caption": "London Day",
      "description": "Facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum.", 
      "externalLink": null, 
      "identifier": {
        "id": "802962f3-7d49-11e3-8b58-28cfe91db661",
        "type": "MemberActivity"
      },
      "imageURL": "//media.rivet.works/3b806861789d4a4ca41c06589abc624b.jpeg",
      "likes": 0, 
      "mediaDisplayURL": null, 
      "mediaID": "802962f3-7d49-11e3-8b58-28cfe91db661",
      "mediaOriginalURL": null, 
      "mediaThumbURL": "//media.rivet.works/3b806861789d4a4ca41c06589abc624b.jpeg",
      "mediaType": "Photo",
      "tags": {
        "city": ["London" ],
        "type": ["day"]
      },
      "userName": null, 
      "userProfilePictureURL": null 
},
    {
      "caption": "My last Mad Dog",
      "description": null, 
      "duration": 10, 
      "externalLink": null, 
      "height": 240, 
      "identifier": {
        "id": "14c6cffa-d617-11e3-9983-28cfe91db661",
        "type": "MemberActivity"
      },
      "imageURL": "//media.rivet.works/video/98eb4be9293d4ba4a81e67711f16bdac/thumb-00001.jpg",
      "likes": 0, 
      "mediaDisplayURL": null, 
      "mediaID": "14c6cffa-d617-11e3-9983-28cfe91db661",
      "mediaOriginalURL": null, 
      "mediaThumbURL": "//media.rivet.works/video/98eb4be9293d4ba4a81e67711f16bdac/thumb-00001.jpg",
      "mediaType": "Video",
      "tags": {},
      "userName": null, 
      "userProfilePictureURL": null, 
      "videoURL": "//media.rivet.works/video/98eb4be9293d4ba4a81e67711f16bdac/h264/video.mp4",
      "width": 320
    }
  ]
}
```
### Response Properties

Successful responses from the Content API contain the following top–level properties.

| name         | description                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| success      | Indicates the success of the API call; true for successful execution and false if there is an error.                                  |
| totalResults | The number of items that the API found for the embed that match the search qualifiers.                                                |
| data         | A subset of the results based on the limit and offset. See the next section for more information about the objects in the data array. |
{:.table .table-responsive}

