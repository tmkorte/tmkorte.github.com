---
layout: page
title: Rivet Tracking API
summary: The Tracking API enables Rivet analytics and reporting data work for you when you build custom displays. 
---
We have a tracking API that we use for all the interactions with our Rivet displays, collectors, and conversions.

The endpoint for the Tracking API is
`https://tracking.rivet.works/track/activity`

The parameters to the api are:

| name | required | data type | description | default value |
| ---- | -------- | --------- | ----------- | ------------- |
| d    | yes      | integer   | The **date** the event took place expressed as seconds since epoch. |  |
| c    | yes      | string    | The broad **category** for the event.<br>For example, “embed” for events related to Rivet displays. |  |
| a    | yes      | string    | The **action** of the event relative to the category.<br>For example, “view” for Rivet displays.  |  |
| l1   | no       | string    | A **label** for a supplemental piece of information about the event.<br>For example, “emebedId” for Rivet displays |  |
| v1   | if l1 is present       | string    | A **value** for a supplemental piece of information about the event.<br>For example, the public identifier of a Rivet displays |  |
| l2   | if l1 & v1 are present       | string    | The **label** for a second piece of supplemental information. |  |
| v2   | if l2 is present       | string    | The **value** for a second piece of supplemental information.  |  |
| u    | no       | string    | A long–lasting identifier for a **user**.<br>The Rivet platform sets this value in local storage and as a cookie with a key of “_tog.rv-userID”.  |  |
| i    | no       | string    | A short–term *identifier* that the Rivet platform sets in local storage and as a cookie with a key of “_tog.rv-sessionID” |  |
| o    | no       | integer   | The ID for the subsidiary **organization** under which the event took place.<br>The default is the ID for Rivet Works. | 1 |
| r    | no       | integer   | The ID for the **source** of the event.<br>The default is the ID for the “Display” tracking source. | 1 |
| t    | no       | integer   | The amount of **time** the event took to happen in number of milliseconds. |  |
| x    | no       | string    | The e–commerce sales **conversion** data. |  |
| rr   | no       | string    | The page that embeds a Rivet display. This is analogous to a **referrer**. |  |
| q    | no       | string    | The **qualifiers** used when filtering the content of a Rivet display.<br>See [Filtering results](/documentation/content-api/index.html#filtering_results) in the [Rivet Content API](/documentation/content-api/index.html) for an explanation of qualifier parameter.  |  |
{:.table .table-responsive}
