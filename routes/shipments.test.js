"use strict";
// const AxiosMockAdapter = require(
//   "axios-mock-adapter");
// const axios = require("axios");
// const axiosMock = new AxiosMockAdapter(axios);
// let { shipProduct, SHIPIT_SHIP_URL } = require("../shipItApi");
// shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");

/**
 * Tests POST "/"
 */
describe("POST /", function () {
  test("valid", async function () {
    // shipProduct
    //   .mockReturnValue(1234);


    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  //TODO: rather than chain into error, paste whole error object
  test("fails invalid productId, address", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: "1",
        name: "Name",
        addr: "Main",
        zip: "90024"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance.productId is not of a type(s) integer",
      "instance.addr does not match pattern \"^[0-9]+ [a-zA-Z0-9 ]+$\""
    ]);
  });

  test("fails missing name and zip input", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1001,
        addr: "1234 Main Street"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance requires property \"name\"",
      "instance requires property \"zip\""
    ]);
  });

  test("fails extra input", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1001,
        name: "Name",
        addr: "1234 Main Street",
        zip: "90024",
        expedite: "fast!"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual([
      "instance is not allowed to have the additional property \"expedite\""
    ]);
  });

});

