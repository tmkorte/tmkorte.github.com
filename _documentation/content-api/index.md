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

JSON

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
Rison

`
(t:(city:!(Austin,London),type:day),g:(lat:40.833333333,lon:14.25,r:'5 km')
`

For more information about Rison please see https://github.com/Nanonid/rison
