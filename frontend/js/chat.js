const API_BASE_URL = "http://127.0.0.1:8000";

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sendButton = chatForm.querySelector("button");

function addMessage(text, sender) {
	const messageEl = document.createElement("div");
	messageEl.className = `message ${sender}`;
	messageEl.textContent = text;
	chatBox.appendChild(messageEl);
	chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(message) {
	const response = await fetch(`${API_BASE_URL}/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ message })
	});

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}

	return response.json();
}

chatForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const userText = messageInput.value.trim();
	if (!userText) {
		return;
	}

	addMessage(userText, "user");
	messageInput.value = "";
	sendButton.disabled = true;

	try {
		const data = await sendMessage(userText);
		addMessage(data.response ?? "No response returned.", "bot");
	} catch (error) {
		addMessage("Unable to reach backend. Please confirm the API is running.", "bot");
		console.error(error);
	} finally {
		sendButton.disabled = false;
		messageInput.focus();
	}
});

addMessage("Hello! How can I help you today?", "bot");
