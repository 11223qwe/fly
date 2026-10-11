const button = document.querySelector("#check-button");
const buttonLabel = document.querySelector("#button-label");
const feedback = document.querySelector("#feedback");
const statusTitle = document.querySelector("#status-title");
const statusDetail = document.querySelector("#status-detail");
const statusIndicator = document.querySelector("#status-indicator");

async function checkHealth() {
  button.disabled = true;
  buttonLabel.textContent = "Checking…";
  feedback.textContent = "Contacting the local server…";

  try {
    const response = await fetch("/health", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    if (result.status !== "ok" || result.project !== "fly") {
      throw new Error("Unexpected health response");
    }

    statusIndicator.dataset.state = "ok";
    statusTitle.textContent = "Ready for takeoff";
    statusDetail.textContent = "The local server answered successfully.";
    feedback.textContent = "Connection confirmed. Your starter is running.";
  } catch (error) {
    statusIndicator.dataset.state = "error";
    statusTitle.textContent = "Server not reached";
    statusDetail.textContent = "Start the project with npm start, then try again.";
    feedback.textContent = `Health check failed: ${error.message}`;
  } finally {
    buttonLabel.textContent = "Check the connection";
    button.disabled = false;
  }
}

button.addEventListener("click", checkHealth);
checkHealth();
