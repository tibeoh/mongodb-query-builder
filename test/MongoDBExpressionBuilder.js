const MongoDBExpressionBuilder = require("../src/MongoDBExpressionBuilder");

const expect = require("chai").expect;

describe("DynamoDBExpressionBuilder", function() {
  describe("($IS)", function() {
    it("1.", function() {
      let filter = { foo: "bar" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: "bar"
      });
    });
    it("2.", function() {
      let filter = { "foo($IS)": "bar" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: "bar"
      });
    });
    it("3.", function() {
      let filter = { "foo ($IS)": "bar" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: "bar"
      });
    });
    it("4.", function() {
      let filter = { "foo ($IS) ": "bar" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: "bar"
      });
    });
    it("5.", function() {
      let filter = { " foo ($IS) ": "bar" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: "bar"
      });
    });
    it("6.", function() {
      let filter = { fee: { " foo ($IS) ": "bar" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.foo": "bar"
      });
    });
    it("7.", function() {
      let filter = { fee: { " foo ": "bar" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.foo": "bar"
      });
    });
    it("8.", function() {
      let filter = { faa: { fee: { " foo ($IS) ": "bar" } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.fee.foo": "bar"
      });
    });
    it("9.", function() {
      let filter = { "faa.point": { fee: { " foo ($IS) ": "bar" } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.point.fee.foo": "bar"
      });
    });
    it("10.", function() {
      let filter = { fee: { " foo ($IS) ": "bar", faa: "fii" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.foo": "bar",
        "fee.faa": "fii"
      });
    });
  });

  describe("($OR) ($IS)", function() {
    it("1.", function() {
      let filter = {
        faa: {
          "($OR)": [{ fee: { " foo ($IS) ": "bar" } }, { fuu: "foo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $or: [
          {
            "faa.fee.foo": "bar"
          },
          {
            "faa.fuu": "foo"
          }
        ]
      });
    });
    it("2.", function() {
      let filter = {
        "($OR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $or: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("3.", function() {
      let filter = {
        "($OR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }],
        gee: "ree"
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $or: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ],
        gee: "ree"
      });
    });
    it("4.", function() {
      let filter = {
        gee: "ree",
        "($OR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        gee: "ree",
        $or: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("5.", function() {
      let filter = {
        faa: {
          gee: "ree",
          "($OR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        $or: [
          {
            "faa.foo": "bar",
            "faa.fuu": "foo"
          },
          {
            "faa.foo": "fee",
            "faa.fuu": "poo"
          }
        ]
      });
    });
    it("6.", function() {
      let filter = {
        faa: {
          gee: "ree",
          gaa: {
            gii: { "fuu ($IS)": "tree" },
            "($OR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
          }
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        "faa.gaa.gii.fuu": "tree",
        $or: [
          {
            "faa.gaa.foo": "bar",
            "faa.gaa.fuu": "foo"
          },
          {
            "faa.gaa.foo": "fee",
            "faa.gaa.fuu": "poo"
          }
        ]
      });
    });
    it("7.", function() {
      let filter = {
        gee: "ree",
        "($OR)": []
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("8.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($OR)": [] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("9.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($OR)": ["fee", "foo", "faa"] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("10.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($OR)": [1, { foo: "faa" }, { fuu: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("11.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($OR)": [1, { foo: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
  });

  describe("($AND) ($IS)", function() {
    it("1.", function() {
      let filter = {
        faa: {
          "($AND)": [{ fee: { " foo ($IS) ": "bar" } }, { fuu: "foo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $and: [
          {
            "faa.fee.foo": "bar"
          },
          {
            "faa.fuu": "foo"
          }
        ]
      });
    });
    it("2.", function() {
      let filter = {
        "($AND)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $and: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("3.", function() {
      let filter = {
        "($AND)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }],
        gee: "ree"
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $and: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ],
        gee: "ree"
      });
    });
    it("4.", function() {
      let filter = {
        gee: "ree",
        "($AND)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        gee: "ree",
        $and: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("5.", function() {
      let filter = {
        faa: {
          gee: "ree",
          "($AND)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        $and: [
          {
            "faa.foo": "bar",
            "faa.fuu": "foo"
          },
          {
            "faa.foo": "fee",
            "faa.fuu": "poo"
          }
        ]
      });
    });
    it("6.", function() {
      let filter = {
        faa: {
          gee: "ree",
          gaa: {
            gii: { "fuu ($IS)": "tree" },
            "($AND)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
          }
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        "faa.gaa.gii.fuu": "tree",
        $and: [
          {
            "faa.gaa.foo": "bar",
            "faa.gaa.fuu": "foo"
          },
          {
            "faa.gaa.foo": "fee",
            "faa.gaa.fuu": "poo"
          }
        ]
      });
    });
    it("7.", function() {
      let filter = {
        gee: "ree",
        "($AND)": []
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("8.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($AND)": [] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("9.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($AND)": ["fee", "foo", "faa"] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("10.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($AND)": [1, { foo: "faa" }, { fuu: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("11.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($AND)": [1, { foo: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
  });

  describe("($NOR) ($IS)", function() {
    it("1.", function() {
      let filter = {
        faa: {
          "($NOR)": [{ fee: { " foo ($IS) ": "bar" } }, { fuu: "foo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $nor: [
          {
            "faa.fee.foo": "bar"
          },
          {
            "faa.fuu": "foo"
          }
        ]
      });
    });
    it("2.", function() {
      let filter = {
        "($NOR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $nor: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("3.", function() {
      let filter = {
        "($NOR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }],
        gee: "ree"
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $nor: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ],
        gee: "ree"
      });
    });
    it("4.", function() {
      let filter = {
        gee: "ree",
        "($NOR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        gee: "ree",
        $nor: [
          {
            foo: "bar",
            fuu: "foo"
          },
          {
            foo: "fee",
            fuu: "poo"
          }
        ]
      });
    });
    it("5.", function() {
      let filter = {
        faa: {
          gee: "ree",
          "($NOR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        $nor: [
          {
            "faa.foo": "bar",
            "faa.fuu": "foo"
          },
          {
            "faa.foo": "fee",
            "faa.fuu": "poo"
          }
        ]
      });
    });
    it("6.", function() {
      let filter = {
        faa: {
          gee: "ree",
          gaa: {
            gii: { "fuu ($IS)": "tree" },
            "($NOR)": [{ "foo ($IS) ": "bar", fuu: "foo" }, { "foo ($IS) ": "fee", fuu: "poo" }]
          }
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.gee": "ree",
        "faa.gaa.gii.fuu": "tree",
        $nor: [
          {
            "faa.gaa.foo": "bar",
            "faa.gaa.fuu": "foo"
          },
          {
            "faa.gaa.foo": "fee",
            "faa.gaa.fuu": "poo"
          }
        ]
      });
    });
    it("7.", function() {
      let filter = {
        gee: "ree",
        "($NOR)": []
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("8.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($NOR)": [] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("9.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($NOR)": ["fee", "foo", "faa"] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("10.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($NOR)": [1, { foo: "faa" }, { fuu: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("11.", function() {
      let filter = {
        gee: "ree",
        fee: { lee: { "($NOR)": [1, { foo: "faa" }] } }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
  });

  describe("($IS NOT)", function() {
    it("1.", function() {
      let filter = { "foo ($IS NOT)": true };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: { $ne: true }
      });
    });
  });

  describe("($GT)", function() {
    it("1.", function() {
      let filter = { "foo ($GT)": 100 };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: { $gt: 100 }
      });
    });
  });

  describe("($LT)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($LT)": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $lt: 100 }
      });
    });
  });

  describe("($NOT) ($GT)", function() {
    it("1.", function() {
      let filter = { "foo ($NOT)($GT)": 100 };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: { $lt: 100 }
      });
    });
  });

  describe("($NOT) ($LT)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($NOT)($LT)": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $gt: 100 }
      });
    });
  });

  describe("($GT) ($LT)", function() {
    it("1.", function() {
      let filter = { "($OR)": [{ "foo ($LT)": 100 }, { "foo ($GT)": 1000 }] };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $or: [
          {
            foo: { $lt: 100 }
          },
          {
            foo: { $gt: 1000 }
          }
        ]
      });
    });
    it("2.", function() {
      let filter = { "fee($GT)": 400, "($OR)": [{ "foo ($LT)": 100 }, { "foo ($GT)": 1000 }] };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        fee: { $gt: 400 },
        $or: [
          {
            foo: { $lt: 100 }
          },
          {
            foo: { $gt: 1000 }
          }
        ]
      });
    });
  });

  describe("($GTE)", function() {
    it("1.", function() {
      let filter = { "foo ($GTE)": 100 };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: { $gte: 100 }
      });
    });
  });

  describe("($LTE)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($LTE)": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $lte: 100 }
      });
    });
  });

  describe("($NOT) ($GTE)", function() {
    it("1.", function() {
      let filter = { "foo ($NOT) ($GTE)": 100 };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        foo: { $lte: 100 }
      });
    });
  });

  describe("($NOT) ($LTE)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($NOT) ($LTE)": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $gte: 100 }
      });
    });
  });

  describe("($IN)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($IN)": ["yellow", "black"] } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      let objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $in: ["yellow", "black"] }
      });
    });
    it("2.", function() {
      let filter = { fee: { faa: { "foo ($IN)": ["yellow", "black"] } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build({
        "fee.faa.foo": { $in: ["yellow", "black"] }
      });
      expect(objectReturned).to.be.eql({ "fee.faa.foo": { $in: ["yellow", "black"] } });
    });
    it("3.", function() {
      let filter = { fee: { faa: { "foo ($IN)": ["yellow", "black"] } }, gee: "blue" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.faa.foo": { $in: ["yellow", "black"] },
        gee: "blue"
      });
    });
    it("4.", function() {
      let filter = { feee: "tre", faa: { "foo ($IN)": [] }, gee: "oui" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
  });

  describe("($NOT) ($IN)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($NOT) ($IN)": ["yellow", "black"] } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $nin: ["yellow", "black"] }
      });
    });
    it("2.", function() {
      let filter = { fee: { faa: { "foo ($NOT) ($IN)": ["yellow", "black"] } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.faa.foo": { $nin: ["yellow", "black"] }
      });
    });
    it("3.", function() {
      let filter = { fee: { faa: { "foo ($NOT) ($IN)": ["yellow", "black"] } }, gee: "blue" };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "fee.faa.foo": { $nin: ["yellow", "black"] },
        gee: "blue"
      });
    });
  });

  describe("($OR) ($IN)", function() {
    it("1.", function() {
      let filter = {
        faa: {
          "($OR)": [{ "foo ($IN)": ["yellow", "black"] }, { "fii ($IN)": ["blue", "green"] }]
        }
      };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        $or: [
          {
            "faa.foo": { $in: ["yellow", "black"] }
          },
          {
            "faa.fii": { $in: ["blue", "green"] }
          }
        ]
      });
    });
  });

  describe("($BETWEEN)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($BETWEEN)": { min: 210, max: 300 } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $lte: 300, $gte: 210 }
      });
    });
  });

  describe("($NOT) ($BETWEEN)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($NOT) ($BETWEEN)": { min: 210, max: 300 } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $gte: 300, $lte: 210 }
      });
    });
  });

  describe("($OUTSIDE)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($OUTSIDE)": { min: 210, max: 300 } } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $gte: 300, $lte: 210 }
      });
    });
  });

  describe("($CONTAINS)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($CONTAINS)": "f" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $regex: ".*f.*" }
      });
    });
  });

  describe("($EXIST)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($EXIST)": true } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $exists: true }
      });
    });
  });
  describe("NOT ($EXIST)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($EXIST)": false } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $exists: false }
      });
    });
  });
  describe("($BEGINS WITH)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($BEGINS WITH)": "f" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $regex: "f.*" }
      });
    });
  });
  describe("($NOT) ($BEGINS WITH)", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($NOT) ($BEGINS WITH)": "f" } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      const objectReturned = DDBExprParser.build();
      expect(objectReturned).to.be.eql({
        "faa.foo": { $regex: ".*f" }
      });
    });
  });

  describe("Invalid operator", function() {
    it("1.", function() {
      let filter = { faa: { "foo ($INVALID_OPERATOR)": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
    it("2.", function() {
      let filter = { faa: { "foo $($ IN )": 100 } };
      let DDBExprParser = new MongoDBExpressionBuilder(filter);
      expect(DDBExprParser.build).to.throw(Error);
    });
  });
});
