import { jest } from "@jest/globals";

describe("App functionality", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="activities-list"></div>
      <select id="activity"></select>
      <form id="signup-form">
        <input id="email" />
        <button type="submit">Sign Up</button>
      </form>
      <div id="message" class="hidden"></div>
    `;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchActivities populates activities list and dropdown", async () => {
    const mockActivities = {
      Yoga: {
        description: "A relaxing yoga session.",
        schedule: "Monday 6 PM",
        max_participants: 10,
        participants: ["alice@example.com"],
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    const { fetchActivities } = await import("./app.js");
    await fetchActivities();

    const activitiesList = document.getElementById("activities-list");
    const activitySelect = document.getElementById("activity");

    expect(activitiesList.innerHTML).toContain("Yoga");
    expect(activitySelect.innerHTML).toContain('<option value="Yoga">Yoga</option>');
  });

  test("unregisterFromActivity shows success message on successful unregister", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Unregistered successfully" }),
    });

    const { unregisterFromActivity } = await import("./app.js");
    await unregisterFromActivity("Yoga", "alice@example.com");

    const messageDiv = document.getElementById("message");
    expect(messageDiv.textContent).toBe("Unregistered successfully");
    expect(messageDiv.className).toBe("success");
  });

  test("Form submission shows success message on successful signup", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Signed up successfully" }),
    });

    const { fetchActivities } = await import("./app.js");
    const signupForm = document.getElementById("signup-form");
    const emailInput = document.getElementById("email");
    const activitySelect = document.getElementById("activity");

    emailInput.value = "bob@example.com";
    activitySelect.innerHTML = '<option value="Yoga">Yoga</option>';
    activitySelect.value = "Yoga";

    const submitEvent = new Event("submit");
    signupForm.dispatchEvent(submitEvent);

    const messageDiv = document.getElementById("message");
    expect(messageDiv.textContent).toBe("Signed up successfully");
    expect(messageDiv.className).toBe("success");
  });
});
