import request from "supertest";
import app from './app.js'; // Adjust the path to your app.js file

describe("Subscription Service API", () => {
  describe("Authentication Routes", () => {
    describe("POST /auth/sign-in --> login user", () => {
        describe("with Valid Credentials", () => {
            //should return 200 and user data
            test("should return 200", async () => {
                const response = await request(app).post("/api/v1/auth/sign-in").send({
                    username: "testuser",
                    password: "testpassword"
                })
                expect(response.statusCode).toBe(200);
            })
            //should respond with users data
            test("should respond with user data", async() =>{
                const response = await request(app).post("/api/v1/auth/sign-in").send({
                
                    username: "testuser",
                    password: "testpassword"
                })
                expect(response.body).toHaveProperty("user");
            })
            //should specify json in the content type header
        })

        describe("with Invalid Credentials", () => {
            //should return 401 
            test("should return 401 Unauthorized", async () => {
                const bodyData = [
                   {username: "wronguser"},
                    {password: "wrongpassword"},
                    {}
                ]

                for (const data of bodyData) {
                    const response = await request(app).post("/api/v1/auth/sign-in").send(data);
                    expect(response.statusCode).toBe(401);
                }
            })
            //should respond with an error message
            //should specify json in the content type header
        });
    });
  });
});
