---
layout: page
title: Rivet Content API
---
The Rivet Platform allows brands and retailers to collect a variety of engaging user generated content – including rich media (photos and videos), geolocation, and commentary – directly from their customers. Rivet offers a collection of embeddable JavaScript displays that allow brands and retailers to easily display the user generated content on their own websites using only a few lines of code. For those customers in search of a more custom display experience, we offer the Rivet Content API. Customers can use the API to create their own galleries of user generated content and integrate the content anywhere on their website.

The Content API returns user generated content based on an display’s data and moderation configuration. Customers create and configure displays using the Rivet Administrative Interface. The Content API also allows for filtering the results it returns based on tags and location data associated with the content.
{:.section-block}

## Calling the API

You call the API using the following endpoint. This example returns 24 pieces of content starting at the beginning of the results set.

```
https://api.rivet.works/embedded/data/{displayIdentifier}
```

The `displayIdentifier` at the end of the URL is the ID that the Rivet platform assigned to the display. You can also define a unique display key in the Rivet Administrative Interface and use that in the API call. The display key allows for “friendlier” URL formats. Each display key must be unique across the Rivet platform.

There are three ways to affect the results the API returns for a display. You can configure a display using the Rivet Administrative Interface, moderate content using the Rivet Administrative Interface, and [filter results](#filtering_results) in the call to the API. When you configure a display you can specify the sources for the content of a display. You can also configure the publishing mode of a display. If you select "hide response before moderation" as the publishing mode, the Content API will return only approved content.

The Content API never returns rejected content.
{:.fa-thumbs-up.icon-holder .callout-block .callout-info}

### Optional query parameters

|name    |description                                                                                                                                                             |default value|
|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| limit |Number of data items for the API to return. | 24 |
| offset |Index into the result set from which to start returning results. | 0 |
| q |Qualifiers for filtering the results. See section “[Filtering Results](#filtering_results)”. | None |
| sort | The order in which to receive results. See section “[Sorting Results](#sorting_results)”  | Submission date, most recent first |
| callback |Support for JSONP. Passing a function name as the “callback” parameter to the API will return the result object wrapped with a JavaScript function call to the callback.| None |
| i |Tracking identifier that you define. This allows you to track user activity through our analytics. | None |
{:.table .table-responsive}

**Note:** The limit and offset parameters support paging through content.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}

### <a name="filtering_results"></a>Filtering results

The Content API allows you to filter results using tags and location data. Tags are assigned to content when users complete a Rivet activity. Also, moderators using the Rivet Administrative Interface can edit the tags for user activity submissions.  Location data is based on the geolocation information provided by the user or that an uploaded photo contains.

Rivet displays use what is called a page context to tell the API how to filter results. The page context is a JSON object that specifies which tags and/or geolocation response content must match for the API to include them in the results. The page context supports a variety of logical expressions for customizing filtering criteria.

For more information about the page context see the section “Website Integration” in the “Rivet Technical Integration Guide.”

Filtering with the Content API is very similar to the display’s page context. The API calls its filtering parameter `qualifier`. Instead of being a JSON object as is the display’s page context, the qualifier for the API is expressed as Rison. The API uses Rison because it is more compact than JSON and better suited for expressing a complex object as a query parameter.

The following is an example of a JSON page context and its corresponding Rison qualifier:

#### JSON

```
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

```
q=(t:(city:!(Austin,London),type:day),g:(lat:40.833333333,lon:14.25,r:'5 km')
```

**Note:** The Rison qualifier must be URL encoded.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}


For more information about Rison please see [https://github.com/Nanonid/rison](https://github.com/Nanonid/rison).

### Showing specific content

In addition to filtering it is possible to request specific pieces of content from the API. You can ask for content by its submission identifier. This Rivet Administrative Interface shows submission identifiers in the moderation interface. The submission identifier is also in the response from the Content API at the `identifier.id` path for each data element.

The Content API will return the content you specify regardless of the publishing mode. The Content API never returns rejected content
{:.fa-thumbs-up.icon-holder .callout-block .callout-info}

The following is an example of a JSON page context that asks for two specific pieces of content followed by it's corresponding Rison qualifier:

#### JSON

```
"pageContext": {
  "submissionIds": [
    "4992d848-d0f0-11e5-9577-22000afe5763",
    "7bafdc00-bba0-11e5-9356-22000ae60646"
  ]
 }
```
#### Rison

```
q=(s:!('4992d848-d0f0-11e5-9577-22000afe5763','7bafdc00-bba0-11e5-9356-22000ae60646'))
```

**Note:** The Rison qualifier must be URL encoded.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}


### Qualifier keys

The qualifier supports three top-level keys for tags, geolocations, and submission identifiers. See the section “Website Integration” in the “Rivet Implementation Guide” for more information about the tags and geoRegion qualifiers.

| name | description                                                    |
| ---- | -------------------------------------------------------------- |
| t    | Analogous to the tags key in a display’s page context.         |
| g    | Analogous to the geoRegion key in a display’s page context.    |
| s    | Analogous to the submissionIds key in a display’s page context |
{:.table .table-responsive}

**Note:** While the top-level Rison keys are shortened to make request URLs more compact, the keys of the tags and geoRegion objects are not shortened.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}

### <a name="sorting_results"></a>Sorting results

The Content API allows you to sort results using a variety of fields. You specify what to sort by using a list of field and sort order pairs. The Content API sorts results by the first field in the sort order list. The API then sorts using the second field within the first and so on.

By default the Content API sorts result by their submission date with the most recent submission first. Specifying a sort replaces the default submission date sort. If you want to sort content by some property and then by submission date, you must include the submission date in your sort order list.

Rivet displays use the page context for specifying the sorting of content. Because of this, sorting using the Content API follows a similar pattern to filtering. Below are examples of specifying a sorting in a page context and the corresponding Rison.

#### JSON

```
"pageContext": {
  "sortOrder": [
    {
      "field": "tags.rank",
      "order": "asc"
    },
    {
      "field": "submissionDate",
      "order": "desc"
    }
  ]
 }
```

#### Rison

```
sort=!((f:tags.rank,o:asc),(f:submissionDate,o:desc))
```

### Sorting keys

The sort order supports two top-level keys for the field to sort by and the order of the sort. See the section “Website Integration” in the “Rivet Implementation Guide” for more information about sorting.

| name | description                                                    |
| ---- | -------------------------------------------------------------- |
| f    | Analogous to the field key in a display’s page context.        |
| o    | Analogous to the order key in a display’s page context.        |
{:.table .table-responsive}

### Examples
Below are examples of calls to the API. The qualifier parameters in the examples are not URL encoded for ease of reading. In production use, the qualifier should be URL encoded.

#### Loading the first “page” of content with 24 pieces of content per page:
```
https://api.rivet.works/embedded/data/{displayIdentifier}?limit=24&offset=0
```

#### Loading the second page of content.
Notice that the limit is added to the offset for each page.
```
https://api.rivet.works/embedded/data/{displayIdentifier}?limit=24&offset=24
```

#### Calling the API with a JSONP callback function.
This is how Rivet’s displays most often uses the API. This example results in a call to the window.dataLoaded function with the response from the API as the only parameter. It is up to you to write the callback function.
```
https://api.rivet.works/embedded/data/{displayIdentifier}?limit=24&offset=24&callback=window.dataLoaded
```

#### Using the API with a filter for responses tagged with a cost of two dollars.
```
https://api.rivet.works/embedded/data/rivet-culture-grid?q=(t:(cost:twodollar))
```

#### Tracking your user using the tracking identifier.
```
https://api.rivet.works/embedded/data/{displayIdentifier}?limit=24&offset=24&i=192837
```

#### Getting responses within a 5 mile radius of a location tagged with summer.

```
https://api.rivet.works/embedded/data/{displayIdentifier}?limit=24&offset=24&i=192837&q=(g:(lat:40.833333333,lon:14.25,r:'5 mi'),t:(season:summer))
```

## Responses from the API

The response from the API is a JSON object. Successful responses from the Content API contain the following top–level properties. The other properties at the top level are for Rivet’s use by our display and subject to change.

| name         | description                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| success      | Indicates the success of the API call; true for successful execution and false if there is an error.                                  |
| totalResults | The number of items that the API found for the display that match the search qualifiers.                                                |
| data         | A subset of the results based on the limit and offset. See the next section for more information about the objects in the data array. |
{:.table .table-responsive}

### Example response
Below is an example of a response from the API from the display for the [Rivet culture page](http://www.rivet.works/our-culture).

```
{
  "aggregations": {
  },
  "configuration": null,
  "data": [
    {
      "identifier": {
        "id": "4992d848-d0f0-11e5-9577-22000afe5763",
        "type": "MemberActivity"
      },
      "ingredients": [
        {
          "displayLabel": "Where it happened:",
          "googlePlaceID": {
            "primitiveType": "Text",
            "text": "ChIJS40b8fPMRIYRlTUN5qUlQXM"
          },
          "ingredientType": "Location",
          "latitude": {
            "primitiveType": "Numeric",
            "value": 30.41851
          },
          "locationText": {
            "primitiveType": "Text",
            "text": "Chuy's"
          },
          "longitude": {
            "primitiveType": "Numeric",
            "value": -97.74786399999999
          },
          "taskId": "cbe64eca-3c93-11e5-b061-22000a128c8c"
        },
        {
          "display640Original": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/da1ca17c7ed64e47969e63ab4424fe8b.jpeg"
          },
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/ff0f6227b3b44b56b1b0519cf1b67067.jpeg"
          },
          "ingredientType": "Photo",
          "name": "Hero media",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/ff0f6227b3b44b56b1b0519cf1b67067.jpeg"
          },
          "taskId": "775e7972-3c93-11e5-ae1e-22000a128c8c",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/ff0f6227b3b44b56b1b0519cf1b67067.jpeg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "Roads... We don't need roads"
          }
        },
        {
          "display640Original": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/16c2a26e18ae4f24b9dc18f07e36fe73.jpeg"
          },
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/c03de5be6c6e4c83ae0bb6915556f769.jpeg"
          },
          "ingredientType": "Photo",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/c03de5be6c6e4c83ae0bb6915556f769.jpeg"
          },
          "taskId": "9d235416-3c93-11e5-bfdd-22000a24170b",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/c03de5be6c6e4c83ae0bb6915556f769.jpeg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "1.21 gigawatts"
          }
        },
        {
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/video/fc39c4bee1934eacbf1bc52bbb2fd513/thumb-00001.jpg"
          },
          "ingredientType": "Video",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/video/fc39c4bee1934eacbf1bc52bbb2fd513/thumb-00001.jpg"
          },
          "taskId": "b767d55e-3c93-11e5-b5ba-22000a24170b",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/video/fc39c4bee1934eacbf1bc52bbb2fd513/thumb-00001.jpg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "88 mph"
          },
          "video": {
            "duration": 61,
            "height": 720,
            "primitiveType": "Video",
            "url": "//media.rivet.works/video/fc39c4bee1934eacbf1bc52bbb2fd513/h264/video.mp4",
            "width": 1280
          }
        },
        {
          "displayLabel": "The story goes a little somethin' like this:",
          "ingredientType": "Text",
          "name": "Story text",
          "taskId": "775fddb2-3c93-11e5-ae1e-22000a128c8c",
          "text": {
            "primitiveType": "Text",
            "text": "Chuys is a classic Austin spot and always great for some untraditional Tex-mex. The food was great as usual and to top it off, someone took a trip back in time and decided to park the DeLorean out front. This thing looked like the real deal. I want it!"
          }
        }
      ],
      "likes": 0,
      "mappings": {
        "description": 4,
        "media": 1
      },
      "socialUser": null,
      "sortings": [
        1,
        2,
        3,
        4,
        0
      ],
      "source": {
        "id": "775dbac8-3c93-11e5-ae1e-22000a128c8c",
        "type": "ProjectActivity"
      },
      "submissionDate": "2016-02-11T18:58:45.000Z",
      "tags": {
        "_featured": [
          "true"
        ],
        "austinitestatus": [
          "burntorange"
        ],
        "cost": [
          "twodollar"
        ],
        "uid": [
          "BenLeeSchneider"
        ]
      },
      "uses": [
        {
          "identifier": {
            "id": "3c766f24-782d-11e5-8c65-22000ad9d511",
            "type": "Embed"
          },
          "likes": 5
        }
      ],
      "valid": true
    },
    {
      "identifier": {
        "id": "7bafdc00-bba0-11e5-9356-22000ae60646",
        "type": "MemberActivity"
      },
      "ingredients": [
        {
          "displayLabel": "Where it happened:",
          "googlePlaceID": {
            "primitiveType": "Text",
            "text": "ChIJvxoI1ge1RIYRbbmLEppInaE"
          },
          "ingredientType": "Location",
          "latitude": {
            "primitiveType": "Numeric",
            "value": 30.26452399999999
          },
          "locationText": {
            "primitiveType": "Text",
            "text": "JW Marriott Austin"
          },
          "longitude": {
            "primitiveType": "Numeric",
            "value": -97.74343499999998
          },
          "taskId": "cbe64eca-3c93-11e5-b061-22000a128c8c"
        },
        {
          "display640Original": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/aa6e71e093e9451188c3243f78a4cec0.jpeg"
          },
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/29ebb76e46744a619509b7f3a10c5515.jpeg"
          },
          "ingredientType": "Photo",
          "name": "Hero media",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/29ebb76e46744a619509b7f3a10c5515.jpeg"
          },
          "taskId": "775e7972-3c93-11e5-ae1e-22000a128c8c",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/29ebb76e46744a619509b7f3a10c5515.jpeg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "Lobby"
          }
        },
        {
          "display640Original": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/f6e8102543994a10b955328d04379ffc.jpeg"
          },
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/7757b8c98c654e6c9316732ec177523b.jpeg"
          },
          "ingredientType": "Photo",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/7757b8c98c654e6c9316732ec177523b.jpeg"
          },
          "taskId": "9d235416-3c93-11e5-bfdd-22000a24170b",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/7757b8c98c654e6c9316732ec177523b.jpeg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "Outdoor seating at Corner Bar"
          }
        },
        {
          "display640Original": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/029321ee603d4865b6fc50846d60b8d4.jpeg"
          },
          "display640Square": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/12d6d3c97a5c4b3abd34c54bd9aa1663.jpeg"
          },
          "ingredientType": "Photo",
          "photo": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/12d6d3c97a5c4b3abd34c54bd9aa1663.jpeg"
          },
          "taskId": "b767d55e-3c93-11e5-b5ba-22000a24170b",
          "thumbnail": {
            "primitiveType": "Photo",
            "url": "//media.rivet.works/12d6d3c97a5c4b3abd34c54bd9aa1663.jpeg"
          },
          "title": {
            "primitiveType": "Text",
            "text": "\"He was no Tina\""
          }
        },
        {
          "displayLabel": "The story goes a little somethin' like this:",
          "ingredientType": "Text",
          "name": "Story text",
          "taskId": "775fddb2-3c93-11e5-ae1e-22000a128c8c",
          "text": {
            "primitiveType": "Text",
            "text": "We had a little team meetup & happy hour outside at the Corner Bar. Our server was really attentive, and it was a nice, mellow setting. The beer and drink menu seemed to have a lot of great stuff on it; I went with the Live Oak Hef, which I really like."
          }
        }
      ],
      "likes": 0,
      "mappings": {
        "description": 4,
        "media": 1
      },
      "socialUser": null,
      "sortings": [
        1,
        2,
        3,
        4,
        0
      ],
      "source": {
        "id": "775dbac8-3c93-11e5-ae1e-22000a128c8c",
        "type": "ProjectActivity"
      },
      "submissionDate": "2016-01-15T16:08:24.000Z",
      "tags": {
        "_featured": [
          "true"
        ],
        "austinitestatus": [
          "decade"
        ],
        "cost": [
          "onedollar"
        ]
      },
      "uses": [
        {
          "identifier": {
            "id": "3c766f24-782d-11e5-8c65-22000ad9d511",
            "type": "Embed"
          },
          "likes": 1
        }
      ],
      "valid": true
    }
  ],
  "success": true,
  "summarizations": {
  },
  "totalResults": 142
}
```
## Data objects

Objects in the data array represent content for a display.

All data objects have these properties.

| name        | description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| identifier | An object that uniquely identifies a piece of content. The object has `id` and `type` properties. The `id` is a UUID for the content assigned by the Rivet platform. The `type` is the kind of content. Possible types are `MemberActivity` or `AlbumMedia`. |
| source | An object that uniquely identifies the source of a piece of content. The object has `id` and `type` properties. The `id` is a UUID for the source assigned by the Rivet platform. The `type` is the kind of source. Possible types are `ProjectActivity` or `Album`. |
| tags | Any tags associated with the content. |
| uses | A list of how this content has been used throughout the Rivet system. |
| submissionDate | The date the content contributor supplied the content. |
| mappings | A mapping of named ingredients to their index in the ingredients list. |
| ingredients | A list of elements that make up collection of content. |
| sortings | A list of indexes that define the order in which the content of the ingredients list should appear. |
| socialUser | The creator of curated media. This only applies to album media content. |
| likes | Number of times viewers of this content clicked the like icon in the Rivet display. |
| valid | A boolean value that indicates whether the piece of content is valid. If there are any issues processing a piece of content the value of this property will be false. |
{:.table .table-responsive}

**Note:** The `sortings` property of each data object dictates the order our display shows ingredients. Do not assume the the order of the ingredients will always be the same. Each data object in the response and its subsequent properties should be treated independently.
{:.fa-fa-exclamation-triangle.icon-holder .callout-block .callout-danger}

## Ingredients

The following sections detail each of the different kinds of ingredients that make up data objects.

### Ingredient properties
Each object in the ingredients array have the following properties in common.

| name | description |
| ---- | ----------- |
| ingredientType | The kind of ingredient. The next section lists the possible ingredient types. |
| name | The symbolic name for the ingredient. You can name an ingredient using the Rivet Administrative Interface. |
| taskId | The identifier for the task within a collector.  |
| displayLabel | The label for the ingredient intended to display in a user interface. You can give an ingredient a display label using the Rivet Administrative Interface. |
{:.table .table-responsive}

### Ingredient types

The following lists all possible ingredient types.

- Location
- Multi Select
- Photo
- Question Group
- Rating
- Single Select
- Slider
- Social User
- Text
- Video

### Ingredient primitives

Each type of ingredient has properties specific to that type. Ingredient–specific properties are called primitives. The following is a list of possible primitives.

| name | description |
| ---- | ----------- |
| Link | A scheme-less URL to a resource on the internet along with a title; for example to a web page. |
| Numeric | A value that is a number such as an integer or a float. |
| Photo | The URL to a photo along with dimensions. |
| Text | A block of text. |
| Video | A URL to a video along with dimensions and duration. |
| YouTube | A URL to a YouTube video. Does not have dimensions or duration. |
{:.table .table-responsive}

### Location

Primitive properties that apply to location ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| latitude | numeric | The latitude of a location expressed as a floating point number of degrees.<br>Positive number are north latitude and negative numbers are south latitude. |
| longitude | numeric | The longitude of a location expressed as a floating point number of degrees.<br>Positive number are east longitude and negative numbers are west longitude. |
| locationText | text | The name of the location. |
| googlePlaceId | text | The Google place ID for the location. |
{:.table .table-responsive}

### Multi select

Primitive properties that apply to multi select ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| choices | text | List of text primitives of the choices the content contributor made with doing the mulit–select task.<br>Each element is the text of the choice for multi-select text tasks and the identifier of the choice for multi-select image tasks. |
{:.table .table-responsive}

### Photo

Primitive properties that apply to photo ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| photo | photo | **Deprecated**. Use display640Square instead. |
| display640Square | photo | A photo that is 640 pixels wide and tall. This is the portion of the photo the content contributor selected during the visual media task in the collector. |
| display640Original | photo | A photo that is at the same aspect ratio as the original photo the content contributor selected during the visual media task in the collector. The longest dimension of the photo is 640 pixels with the other dimension shortened to maintain the original aspect ratio.  |
| title | text | The caption of the photo the content contributor provided during the visual media task in the collector |
| thumbnail | photo | **Deprecated**. Use display640Square instead. |
{:.table .table-responsive}


### Question group

Properties that apply only to question group ingredients.

**Note:** The question group ingredient does not use primitives and is instead a list of objects with the following properties.
{:.fa-thumbs-up.icon-holder .callout-block .callout-success}

| name | description |
| ---- | ----------- |
| displayLabel | The display label for the question as configured in the Rivet Administrative Interface. |
| answer | The answer the content contributor provided while doing the question group task of the collector. |
| visibility | The Rivet platform allows administrators to supersede answers with newer choices. This flag indicates that this question group has been superseded. You may choose whether to show the content of this question group to your users or not. |
{:.table .table-responsive}

### Rating

Primitive properties that apply to rating ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| rating | numeric | The value the content contributor selected while doing the rating task of the collector. |
{:.table .table-responsive}

### Single select

Primitive properties that apply to single select ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| choice | text | The choice the content contributor made for the select task of the collector.<br>It is the text of the choice for single-select text tasks and the identifier of the choice for single-select image tasks. |
{:.table .table-responsive}

### Slider

Primitive properties that apply to slider ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| value | numeric | The value the content contributor selected while doing the slider task of the collector.  |
| startLabel | text | The label of the starting value. |
| endLabel | text | The label of the ending value. |
| points | numeric | The number of points on the slider. |
{:.table .table-responsive}

### Social user

Primitive properties that apply to social user ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| userName | text | The user name from the social network. |
| userImage | photo | The image of the user from the social network.  |
| userLink | link | The link to the user's presence in the social network.  |
| profileProvider | text | The social network of the user. The possible values are:<br>- Instagram<br>- Facebook<br>- Twitter<br>- Pinterest<br>- Google<br>- LinkedIn |
{:.table .table-responsive}

### Text

Primitive properties that apply to text ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| text | text | The text the content contributor provided while doing the task.  |
{:.table .table-responsive}

### Video

Primitive properties that apply to video ingredient types.

| name | primitive | description |
| ---- | --------- | ----------- |
| photo | photo | **Deprecated**. Use display640Square instead. |
| display640Square | photo | A photo that is 640 pixels wide and tall. This is the first frame of the video that the content contributor provided during the visual media task in the collector. |
| title | text | The caption of the video the content contributor provided during the visual media task in the collector |
| thumbnail | photo | **Deprecated**. Use display640Square instead. |
| video | video | The video that the content contributor provided during the visual media task in the collector.  |
{:.table .table-responsive}

## Errors

If the API encounters an error, the response from the API is the following.

```
{ 
  "success": false, 
  "error": -1, 
  "reason": "Technical difficulties"
}
```

| code | message | description |
| ---- | ------- | ----------- |
| -1 | Technical difficulties | An unexpected error has occurred. Contact Rivet Support at support@rivet.works for assistance. |
| -2 | Search error | An error has occurred with the Rivet search engine. Contact Rivet Support at support@rivet.works for assistance. |
| -6 | display not found | The call to the API specifies an display that is not in the Rivet system. |
| -5 | Limit must be one or greater | You must ask for at least one content item. |
| -4 | Offset must be zero or greater | The offset into the results cannot be negative. |
| -3 | Error in qualifier | The qualifier is not Rison encoded correctly. The API includes additional information about where the encoding error is in the Rison. |
{:.table .table-responsive}

## CORS

The API is CORS compliant. If JavaScript from a web page calls the API, the browser must send CORS headers.
