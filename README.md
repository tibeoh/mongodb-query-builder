# Builder for MongoDB

## Features

- Build params object for MongoDB queries
- Create filters object readable and it will be transform for the MongoDB parameter syntax

## Installation

```
npm install mongodb-query-builder
```

## How to use?

```
const DDBBuilder = require("mongodb-query-builder");

let filters = {
  meta_data: {
    "number_of_views ($GT)": 1000000
  }
};

let mongoDBBuilder = new DDBBuilder.MongoDBBuilder();

let params = mongoDBBuilder
  .setFilters(filters)
  .build();
```

Now you have to use `params` variable for your MongoDB query.

```
mongoose.model.find(params).then(values => {
  console.log(values)
})
```

## MongoDBBuilder documentation

It's just an interface to call MongoDBExpressionBuilder. It will return your filters parse as Mongo (or mongoose) should use it

## MongoDBExpressionBuilder documentation

List of operators:

- (\$IS)
- (\$IS NOT)
- (\$IN)
- (\$GT)
- (\$GTE)
- (\$LT)
- (\$LTE)
- (\$BETWEEN)
- (\$NOT) It's the only one to be use before an other operator.
- (\$OR)
- (\$CONTAINS)
- (\$EXISTS)
- (\$OUTSIDE)
- (\$BEGIN WITH)

### Examples

```
let filters = {
  meta_data: {
    "year": 2018,                                           // meta_data.year = 2018
    "original_language ($IS)": "English",                   // meta_data.original_language = "English",
    "runtime ($LTE)" : 5400,                                // meta_data.runtime <= 5400
    "producer ($IN)": ["Avi Arad", "Syed Aman Bachchan"],   // meta_data.producer IN ("Avi Arad", "Syed Aman Bachchan")
    "revenue ($GT)": 10000000,                              // meta_data.revenue > 10000000
    "vote_average ($GTE)": 4,                               // vote_average >= 5
    "budget ($BETWEEN)": { min: 10000000, max: 200000000},  // meta_data.budget BETWEEN 10000000 AND 200000000
    "vote_count ($NOT) ($LT)": 20000                        // NOT meta_data.vote_count < 20000
  }
};
```

Query looks like:

```
{
  "meta_data.year": 2018,
  "meta_data.original_language": "English",
  "meta_data.runtime": { $lte: 5400 },
  "meta_data.producer": { $in: ["Avi Arad", "Syed Aman Bachchan"] },
  "meta_data.revenue": { $gt 1000000 },
  "meta_data.vote_average": { $gte: 4 },
  "meta_data.budget": { $gte: 10000000, $lte 200000000 },
  "meta_data.vote_count": { $gt: 20000 }
}
```

Particularity : (\$OR) and (\$AND) should be the key of the object.

```
let filters = {
  meta_data: {
    "($OR)": [
      {"vote_count ($NOT) ($LT)": 20000},
      {"vote_average ($GTE)": 4}
    ]
  }
};
```

## TODO

- Add Comparison Operator and Function Reference missing: ("(\$BEGINS WITH)", "attribute_exists", "attribute_not_exists", "attribute_type")
