"use strict";

// @TODO "($BEGINS WITH)", "attribute_exists", "attribute_not_exists", "attribute_type"
const ExpressionsMap = ["($IS)", "($ISNOT)", "($IN)", "($GT)", "($GTE)", "($LT)", "($LTE)", "($BETWEEN)", "($AND)", "($OR)", "($NOR)", "($OUTSIDE)", "($CONTAINS)", "($EXIST)", "($BEGINSWITH)"];
const OperatorRegex = /\(.*\)/g;

class MongoDBExpressionBuilder {
  constructor(obj) {
    this.obj = obj;
  }

  build() {
    try {
      return this.formatRect(this.obj);
    } catch (error) {
      throw error;
    }
  }

  formatRect(obj, _prefix) {
    let prefix = _prefix ? _prefix : "";
    let objectToReturned = {};
    Object.keys(obj).forEach(key => {
      const item = obj[key];
      const keyTrimmed = key.replace(/\s/g, "");
      const finalKey = keyTrimmed.replace(OperatorRegex, "");
      if (typeof item === "object" || typeof item === "array") {
        const operatorValuesInformation = this.hasOperator(keyTrimmed);
        if (operatorValuesInformation.array && !operatorValuesInformation.object) {
          objectToReturned[operatorValuesInformation.operator] = item.map(it => {
            if (typeof it !== "object") {
              throw new Error("Element of array must be an object");
            }
            return this.formatRect(it, prefix);
          });
        } else if (operatorValuesInformation.object && !operatorValuesInformation.array) {
          objectToReturned[prefix !== "" ? `${prefix}.${finalKey}` : finalKey] = this.parseOperatorToObject(keyTrimmed, item);
        } else if (typeof item === "object") {
          objectToReturned = Object.assign({}, objectToReturned, this.formatRect(item, prefix !== "" ? `${prefix}.${finalKey}` : finalKey));
        }
      } else {
        const operatorValuesInformation = this.hasOperator(keyTrimmed);
        if (operatorValuesInformation.object) {
          objectToReturned[prefix !== "" ? `${prefix}.${finalKey}` : finalKey] = this.parseOperatorToObject(keyTrimmed, item);
        } else {
          objectToReturned[prefix !== "" ? `${prefix}.${finalKey}` : finalKey] = item;
        }
      }
    });
    return objectToReturned;
  }

  keyHasOperator(key) {
    return ExpressionsMap.filter(ope => key.includes(ope)).length > 0;
  }

  keyHasNotOperator(key) {
    return key.includes("($NOT)");
  }

  hasOperator(key) {
    let objectToReturned = {
      object: false,
      array: false,
      operator: ""
    };
    if (!this.keyHasOperator(key)) {
      return objectToReturned;
    }
    let operator = "";
    if (this.keyHasNotOperator(key)) {
      operator = key.match(OperatorRegex).join("");
    } else {
      operator = key.match(OperatorRegex)[0];
    }
    switch (operator) {
      case "($IS)":
        return Object.assign({}, objectToReturned);
      case "($ISNOT)":
      case "($NOT)($IN)":
      case "($NOT)($GT)":
      case "($NOT)($GTE)":
      case "($NOT)($LT)":
      case "($NOT)($LTE)":
      case "($NOT)($BETWEEN)":
      case "($IN)($NOT)":
      case "($GT)($NOT)":
      case "($GTE)($NOT)":
      case "($LT)($NOT)":
      case "($LTE)($NOT)":
      case "($BETWEEN)($NOT)":
      case "($BEGINSWITH)":
      case "($NOT)($BEGINSWITH)":
      case "($BEGINSWITH)($NOT)":
      case "($IN)":
      case "($GT)":
      case "($GTE)":
      case "($LT)":
      case "($LTE)":
      case "($BETWEEN)":
      case "($OUTSIDE)":
      case "($CONTAINS)":
      case "($EXIST)":
        return Object.assign({}, objectToReturned, { object: true });
      case "($AND)":
        return Object.assign({}, objectToReturned, { array: true, operator: "$and" });
      case "($OR)":
        return Object.assign({}, objectToReturned, { array: true, operator: "$or" });
      case "($NOR)":
        return Object.assign({}, objectToReturned, { array: true, operator: "$nor" });
      default:
        throw new Error("Invalid operator");
    }
  }

  parseOperatorToObject(key, item) {
    let operator = "";
    if (this.keyHasNotOperator(key)) {
      operator = key.match(OperatorRegex).join("");
    } else {
      operator = key.match(OperatorRegex)[0];
    }
    switch (operator) {
      case "($ISNOT)":
        return Object.assign({}, { $ne: item });
      case "($IN)":
        return Object.assign({}, { $in: item });
      case "($GT)":
        return Object.assign({}, { $gt: item });
      case "($GTE)":
        return Object.assign({}, { $gte: item });
      case "($LT)":
        return Object.assign({}, { $lt: item });
      case "($LTE)":
        return Object.assign({}, { $lte: item });
      case "($BETWEEN)":
      case "($NOT)($OUTSIDE)":
      case "($OUTSIDE)($NOT)":
        return Object.assign({}, { $lte: item.max, $gte: item.min });
      case "($NOT)($IN)":
      case "($IN)($NOT)":
        return Object.assign({}, { $nin: item });
      case "($NOT)($GT)":
      case "($GT)($NOT)":
        return Object.assign({}, { $lt: item });
      case "($NOT)($GTE)":
      case "($GTE)($NOT)":
        return Object.assign({}, { $lte: item });
      case "($NOT)($LT)":
      case "($LT)($NOT)":
        return Object.assign({}, { $gt: item });
      case "($NOT)($LTE)":
      case "($LTE)($NOT)":
        return Object.assign({}, { $gte: item });
      case "($NOT)($BETWEEN)":
      case "($BETWEEN)($NOT)":
      case "($OUTSIDE)":
        return Object.assign({}, { $gte: item.max, $lte: item.min });
      case "($CONTAINS)":
        return Object.assign({}, { $regex: `.*${item}.*` });
      case "($EXIST)":
        return Object.assign({}, { $exists: item });
      case "($BEGINSWITH)":
        return Object.assign({}, { $regex: `${item}.*` });
      case "($NOT)($BEGINSWITH)":
      case "($BEGINSWITH)($NOT)":
        return Object.assign({}, { $regex: `.*${item}` });
    }
  }
}

module.exports = MongoDBExpressionBuilder;
