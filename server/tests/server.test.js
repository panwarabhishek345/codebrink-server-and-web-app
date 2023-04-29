const expect = require("expect");
const request = request("supertest");

const { app } = require("./../server");
const { CategoryObject } = require("./../models/CategoryObject");

beforEach(done => {
  CategoryObject.remove({}).then(() => done());
});

describe("POST /CategoryObjects", () => {
  it("should create a new CategoryObject", done => {
    var title = "Test CategoryObject text";

    request(app)
      .post("/CategoryObjects")
      .send({ title })
      .expect(200)
      .expect(() => {
        expect(res.body.text).toBe(title);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        CategoryObject.find()
          .then(CategoryObjects => {
            expect(CategoryObjects.length).toBe(1);
            expect(CategoryObjects[0].text).toBe(title);
            done();
          })
          .catch(e => done(e));
      });
  });
});
