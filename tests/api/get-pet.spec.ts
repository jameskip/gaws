import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://petstore.swagger.io",
});

const petId = 122333;

const expectedResponse = {
  category: { id: 0, name: "string" },
  id: petId,
  name: `doggie ${petId}`,
  photoUrls: ["string"],
  status: "available",
  tags: [{ id: 0, name: "string" }],
};

test.beforeAll(async ({ request }) => {
  await request.post(`/v2/pet`, {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    data: JSON.stringify(expectedResponse),
  });
});

test.afterAll(async ({ request }) => {
  await request.delete(`/v2/pet/${petId}`, {
    headers: { api_key: "special-key" },
  });
});

test(`GET - doggie ${petId}`, async ({ request }) => {
  const response = await request.get(`/v2/pet/${petId}`);

  expect(await response.json()).toEqual(
    expect.objectContaining(expectedResponse)
  );
});
