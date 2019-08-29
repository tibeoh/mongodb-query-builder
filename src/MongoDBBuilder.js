"use strict";

const MongoDBExpressionBuilder = require("./MongoDBExpressionBuilder");

class MongoDBBuilder {
  constructor() {
    this.queryBuilder;
  }

  setFilters(filters) {
    this.queryBuilder = new MongoDBExpressionBuilder(filters);
    return this;
  }

  build() {
    return this.queryBuilder.build();
  }
}

module.exports = MongoDBBuilder;
