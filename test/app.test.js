const request = require("supertest");
const chai = require("chai");
const sinon = require("sinon");
const fs = require("fs");
const app = require("../App");

const { expect } = chai;

describe("Express App", function () {
  let mkdirSyncStub, writeFileSyncStub, existsSyncStub;

  beforeEach(() => {
    mkdirSyncStub = sinon.stub(fs, "mkdirSync");
    writeFileSyncStub = sinon.stub(fs, "writeFileSync");
    existsSyncStub = sinon.stub(fs, "existsSync").returns(false);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("GET / should return 200", async function () {
    const res = await request(app).get("/");
    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include("<form");
  });

  it("POST /send should return success message and write a GDT file", async function () {
    const res = await request(app)
      .post("/send")
      .send({
        nachname: "Tester",
        vorname: "Max",
        geburtsdatum: "1990-01-01",
        versicherungsnummer: "A123456789",
        geschlecht: "M",
        strasse: "Teststraße 1",
        plz: "12345",
        medication: "Aspirin",
        note: "Take at night",
        entryTime: new Date().toISOString(),
      });

    expect(res.statusCode).to.equal(200);
    expect(res.text).to.include("Vielen Dank");
    expect(writeFileSyncStub.called).to.be.true;
  });
});
