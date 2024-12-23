let isDarkMode = true; // Default to dark mode
let isGifVisible = false; // To track if the GIF is currently visible

// Event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to toggle light/dark mode and cat image
function toggleMode() {
    isDarkMode = !isDarkMode; // Toggle the mode
    isGifVisible = !isGifVisible; // Toggle GIF visibility

    const body = document.body;
    const chatContainer = document.querySelector('.chat-container');
    const inputContainer = document.querySelector('.input-container');
    const header = document.querySelector('.header');
    const catImg = document.querySelector('.cat-img');
    
    // Toggle the background color and text color
    if (isDarkMode) {
        body.style.backgroundColor = '#1e1e1e'; // Dark background
        body.style.color = '#f4f4f4'; // Light text color
        chatContainer.style.backgroundColor = '#2d2d2d'; // Dark chat container
        inputContainer.style.backgroundColor = '#333'; // Dark input background
        header.style.backgroundColor = '#444'; // Dark header background

        document.querySelectorAll('.message.bot p').forEach(p => p.style.backgroundColor = '#333'); // Dark message background
        document.querySelectorAll('.message.user p').forEach(p => p.style.backgroundColor = '#ffcc00'); // Light message background
    } else {
        body.style.backgroundColor = '#f0f2f5'; // Facebook light mode background
        body.style.color = '#1c1e21'; // Facebook light mode text color
        chatContainer.style.backgroundColor = '#ffffff'; // Facebook white chat container
        inputContainer.style.backgroundColor = '#ffffff'; // Facebook white input background
        header.style.backgroundColor = '#4267b2'; // Facebook blue header background

        document.querySelectorAll('.message.bot p').forEach(p => p.style.backgroundColor = '#4267b2'); // Facebook light message background
        document.querySelectorAll('.message.user p').forEach(p => p.style.backgroundColor = '#e1f5fe'); // Light user message background
    }

    // Toggle the cat image between original and GIF
    catImg.src = isGifVisible ? 'C:/Users/Serway/Startup/public/news.gif' : 'cat.png'; // Update path for your GIF
}

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    if (userInput === '') return;

    displayMessage(userInput, 'user'); // Display user message
    document.getElementById('userInput').value = '';

    // Add a typing indicator in the chat
    const typingElement = addTypingIndicator();

    // Prevent sending message if one is already pending
    if (document.querySelector('.message.bot p')) return; // Check if there's already a bot message pending

    fetch('https://proj-c508.onrender.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        // Remove the typing indicator before displaying the bot's message
        removeTypingIndicator(typingElement);

        // Check if the reply is already shown, prevent duplicate
        if (!document.querySelector('.message.bot p')) {
            displayMessage(data.reply, 'bot'); // Display bot's reply
        }
    })
    .catch(error => {
        console.error('Error:', error);
        removeTypingIndicator(typingElement);
        displayMessage('ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.', 'bot');
    });
}

function displayMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');

    // Check if the last message is from the same sender
    const lastMessage = messagesContainer.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('message') && lastMessage.classList.contains(sender)) {
        // If it's from the same sender, update the existing message
        lastMessage.querySelector('p').innerHTML = message.replace(/\n/g, '<br>');
        return; // Exit function to avoid adding a new message
    }

    // Create a new message element if it's not a duplicate
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    const messageText = document.createElement('p');

    // Handle new lines in messages
    messageText.innerHTML = message.replace(/\n/g, '<br>'); // Replace new lines with <br>

    messageElement.appendChild(messageText);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Apply typing effect only if it's a bot message
    if (sender === 'bot') {
        // Typing effect
        let i = 0;
        const speed = 25; // Speed of typing effect
        function type() {
            if (i < message.length) {
                messageText.innerHTML += message[i];
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
}

// Function to add a typing indicator
function addTypingIndicator() {
    const messagesContainer = document.getElementById('messages');
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot');

    // Create the animated typing indicator
    typingElement.innerHTML = `
        <p class="typing-indicator">
            <span>.</span><span>.</span><span>.</span>
        </p>
    `;

    messagesContainer.appendChild(typingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return typingElement;
}

// Function to remove the typing indicator
function removeTypingIndicator(typingElement) {
    typingElement.remove();
}

// Add event listener to the cat image for toggling mode
document.querySelector('.cat-img').addEventListener('click', toggleMode);

// Get elements
const feedbackButton = document.getElementById('feedbackButton');
const modal = document.createElement('div');
const modalContent = document.createElement('div');
const closeButton = document.createElement('span');

// Set modal structure
modal.className = 'modal';
modalContent.className = 'modal-content';
closeButton.className = 'modal-close';
closeButton.innerText = '×';
modalContent.innerHTML = `
    <h2>Feedback</h2>
    <p>ส่งการตอบกลับของคุณ:</p>
    <a href="https://forms.gle/jrjkAYQMzNxTZKn5A" target="_blank">Click here to provide feedback</a>
`;

// Append elements
modalContent.appendChild(closeButton);
modal.appendChild(modalContent);
document.body.appendChild(modal);

// Open modal
feedbackButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal if clicked outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
