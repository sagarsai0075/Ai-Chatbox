const API_BASE_URL = "https://ai-chatbox-qnvy.onrender.com";

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sendButton = chatForm.querySelector("button");

function addMessage(text, sender) {
	const messageRow = document.createElement("div");
	messageRow.className = `message-row ${sender}`;

	const avatarEl = document.createElement("div");
	avatarEl.className = "avatar";
	avatarEl.textContent = sender === "user" ? "👤" : "🤖";

	const contentEl = document.createElement("div");
	contentEl.className = "message-content";

	const senderEl = document.createElement("div");
	senderEl.className = "sender";
	senderEl.textContent = sender === "user" ? "You" : "ChatBox";

	const messageEl = document.createElement("div");
	messageEl.className = `message ${sender}`;
	messageEl.textContent = text;

	contentEl.appendChild(senderEl);
	contentEl.appendChild(messageEl);
	messageRow.appendChild(avatarEl);
	messageRow.appendChild(contentEl);
	chatBox.appendChild(messageRow);
	chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingIndicator() {
	const typingRow = document.createElement("div");
	typingRow.className = "message-row chatbox";
	typingRow.id = "typing-indicator";

	const avatarEl = document.createElement("div");
	avatarEl.className = "avatar";
	avatarEl.textContent = "🤖";

	const contentEl = document.createElement("div");
	contentEl.className = "message-content";

	const senderEl = document.createElement("div");
	senderEl.className = "sender";
	senderEl.textContent = "ChatBox";

	const messageEl = document.createElement("div");
	messageEl.className = "message chatbox typing";

	for (let index = 0; index < 3; index += 1) {
		const dot = document.createElement("span");
		dot.className = "typing-dot";
		messageEl.appendChild(dot);
	}

	contentEl.appendChild(senderEl);
	contentEl.appendChild(messageEl);
	typingRow.appendChild(avatarEl);
	typingRow.appendChild(contentEl);
	chatBox.appendChild(typingRow);
	chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
	const typingEl = document.getElementById("typing-indicator");
	if (typingEl) {
		typingEl.remove();
	}
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
	addTypingIndicator();

	try {
		const data = await sendMessage(userText);
		removeTypingIndicator();
		addMessage(data.response ?? "No response returned.", "chatbox");
	} catch (error) {
		removeTypingIndicator();
		addMessage("Unable to reach backend. Please confirm the API is running.", "chatbox");
		console.error(error);
	} finally {
		sendButton.disabled = false;
		messageInput.focus();
	}
});

addMessage("Hello! How can I help you today?", "chatbox");
