### README for Luganodes Deposit Project

---

## Table of Contents:
- [Overview](#overview)
- [Project Structure](#project-structure)
- [How the System Works](#how-the-system-works)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
- [Files and Their Roles](#files-and-their-roles)
  - [server.mjs](#servermjs)
  - [index.mjs](#indexmjs)
  - [deposit.js](#depositjs)
  - [form.html (index.html)](#formhtml)
  - [package.json](#packagejson)
  - [.env](#env)
- [Running the Project](#running-the-project)
- [Detailed Logic Flow](#detailed-logic-flow)
- [Connected Graph](#connected-graph)
- [License](#license)

---

## Overview

The **Luganodes Deposit Project** is a blockchain-related application that tracks Ethereum deposits into a specific contract and provides a user-friendly way to submit deposit details via a frontend form. The application uses **Node.js** for the backend, **Express.js** to handle HTTP requests, **MongoDB** for storing deposit details, and **ethers.js** for interacting with the Ethereum blockchain. Additionally, **Telegram alerts** are sent for every new deposit detected.

---

## Project Structure

```
.
├── server.mjs       # Backend API server for deposit handling and Telegram notifications
├── index.mjs        # Ethereum blockchain tracker for monitoring contract deposits
├── deposit.js       # Mongoose schema for deposit data
├── form.html        # Frontend HTML form to manually submit deposits
├── package.json     # Project dependencies and scripts
├── .env             # Environment variables (API keys, database URI, etc.)
└── README.md        # Project documentation
```

---

## How the System Works

1. **Frontend Form (form.html)**: Users can manually submit deposit details such as `blockNumber`, `from address`, `to address`, `value (ETH)`, and `transaction hash` via a simple HTML form. This form sends a POST request to the backend.

2. **Backend API (server.mjs)**: The API handles the POST request for the deposit. It saves the deposit details to MongoDB and triggers a Telegram alert to notify a specific chat ID about the deposit.

3. **Ethereum Tracker (index.mjs)**: The tracker continuously listens for new blocks on the Ethereum blockchain. When it detects a deposit to a specific contract, it saves the details in MongoDB and logs it.

4. **Database (MongoDB)**: Stores all the deposit data including block numbers, timestamps, addresses, and transaction hashes.

5. **Telegram Bot**: Sends alerts via Telegram every time a new deposit is saved.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing deposit data.
- **Mongoose**: ODM for MongoDB to define deposit schema.
- **ethers.js**: Ethereum blockchain interaction library.
- **Telegram Bot API**: Sends notifications via a Telegram bot.
- **HTML/JavaScript**: Frontend form for user input.
- **CORS**: Middleware to allow cross-origin requests.

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/luganodes-frontend.git
cd luganodes-frontend
```

### 2. Install the necessary dependencies

```bash
npm install
```

### 3. Create a `.env` file and add the following keys:

```
ALCHEMY_API_KEY=your-alchemy-api-key
MONGODB_URI=your-mongodb-connection-uri
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-chat-id
PORT=3000
```

### 4. Start the project

To run both `server.mjs` and `index.mjs` together, use:

```bash
npm start
```

This will run both the server and Ethereum tracker concurrently.

---

## Files and Their Roles

### 1. **server.mjs**

This file contains the Express server, which handles:
- Serving the `form.html` frontend.
- Accepting POST requests for deposits.
- Saving deposit data to MongoDB.
- Sending a Telegram notification when a new deposit is added.

#### Key Logic:
- **POST /deposits**: Receives deposit details (block number, from, to, value, and transaction hash) and saves them to MongoDB.
- **GET /deposits**: Returns all deposit records.
- **GET /deposits/:hash**: Returns a specific deposit by its transaction hash.

### 2. **index.mjs**

This file is responsible for:
- Tracking Ethereum blockchain for new deposits.
- Using `ethers.js` to connect to the Ethereum network via Alchemy.
- Listening to the latest block and filtering transactions to a specific contract address.
- Saving new deposits to MongoDB and logging them.

#### Key Logic:
- **provider.on("block")**: Listens for each new block on Ethereum.
- **getTransaction(txHash)**: Retrieves details of each transaction in the block.
- **Save transaction details to MongoDB**: If the transaction is a deposit, it saves the details.

### 3. **deposit.js**

This file defines the **Mongoose schema** for the deposit data stored in MongoDB. It includes:
- `blockNumber`: Number of the block in which the transaction occurred.
- `blockTimestamp`: Date and time of the block.
- `from`: Address sending the transaction.
- `to`: Address receiving the transaction.
- `value`: Value of the transaction in ETH.
- `hash`: Transaction hash.

### 4. **form.html**

This file is the **frontend** of the project where users can manually input deposit details. It contains:
- Input fields for block number, from/to addresses, ETH value, and transaction hash.
- A submit button that sends a POST request to the backend API.

### 5. **package.json**

This file manages project dependencies and defines the `start` script to run both the `server.mjs` and `index.mjs` concurrently.

### 6. **.env**

This file holds sensitive information like:
- Alchemy API Key for Ethereum blockchain access.
- MongoDB connection URI.
- Telegram bot token and chat ID.

---

## Running the Project

To run the project, ensure that you have set up the `.env` file correctly and then use the following command:

```bash
npm start
```

This command will:
- Start the Express server (`server.mjs`) for handling HTTP requests.
- Start the Ethereum deposit tracker (`index.mjs`) to listen to the blockchain.

### Access the frontend:
- Navigate to `http://localhost:3000` to use the deposit submission form.

### Track blockchain deposits:
- The system will automatically listen for deposits made to the specified contract address on Ethereum, log them, and save them to the database.

---

## Detailed Logic Flow

1. **User submits deposit** via `form.html`:
   - The frontend sends a POST request to the Express backend.
   - The backend validates the input and saves it to MongoDB.
   - A Telegram notification is sent via the bot.

2. **Ethereum deposit detection**:
   - The `index.mjs` file listens to new Ethereum blocks.
   - It filters transactions for deposits to a specific contract address.
   - If a valid deposit is detected, it saves the deposit details in MongoDB.

---

## Connected Graph

Here is a visual representation of how the files are connected:

```
+-----------------+        POST /deposits       +-------------------+
|   form.html     | ------------------------->  |   server.mjs      |
| (Frontend Form) |                             | (Express Server)  |
+-----------------+                             +-------------------+
                                                      |
                                                      | Save to MongoDB
                                                      v
                                              +-------------------+
                                              |   deposit.js      |
                                              | (Mongoose Schema) |
                                              +-------------------+
                                                      |
                                                      | Listen for blockchain events
                                                      v
                                              +-------------------+
                                              |   index.mjs       |
                                              | (Ethereum Tracker)|
                                              +-------------------+
                                                      |
                                                      | Send Telegram Alert
                                                      v
                                              +-------------------+
                                              |   Telegram API    |
                                              +-------------------+
