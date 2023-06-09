import { test, expect } from "@playwright/test";
import { getRandomNumber } from "../../utils/helpers";
import { expectedResponse } from "../constants";

test.use({
  baseURL: "https://petstore.swagger.io",
});

let petId: number;
let petData: {};

// CREATE pet before all tests are run
test.beforeAll(async ({ request }) => {
  petId = getRandomNumber(1, 1000);
  petData = expectedResponse(petId);

  await request.post(`/v2/pet`, {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    data: JSON.stringify(petData),
  });
});

// DELETE pet after all tests are done
test.afterAll(async ({ request }) => {
  await request.delete(`/v2/pet/${petId}`, {
    headers: { api_key: "special-key" },
  });
});

test(`CRUD - Pet`, async ({ request }) => {
  // READ pet by id
  await test.step(`GET - doggie`, async () => {
    const response = await request.get(`/v2/pet/${petId}`);

    expect(await response.json()).toEqual(expect.objectContaining(petData));
  });

  // UPDATE pet status
  await test.step(`PUT - doggie`, async () => {
    const updatedResponse = { ...petData, status: "sold" };

    const response = await request.put(`/v2/pet`, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      data: JSON.stringify(updatedResponse),
    });

    expect(await response.json()).toEqual(
      expect.objectContaining(updatedResponse)
    );
  });
});
