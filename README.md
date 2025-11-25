# 🔐 Zero-Knowledge Secret Vault

A secure, web-based application for sharing sensitive information (passwords, API keys, confidential messages) that self-destructs after being viewed.

Built with **React, Node.js, Express, and Redis**.

<img width="1919" height="943" alt="Screenshot 2025-11-26 013913" src="https://github.com/user-attachments/assets/127e1222-ac1a-460c-84a1-980a5d7ddde4" />


## 🚀 Key Features

* **Zero-Knowledge Architecture:** Encryption happens in the browser (Client-Side). The server stores only the encrypted text and *never* sees the decryption key.
* **AES-256 Encryption:** Utilizes military-grade encryption standards via `crypto-js`.
* **Self-Destructing Messages:** Messages are permanently deleted from the database immediately after being read ("Burn on Read").
* **Ephemeral Storage:** Unread messages automatically expire after a set time (TTL) using Redis.
* **Secure Link Sharing:** Decryption keys are transmitted via URL Hash Fragments (`#`), ensuring they are never sent to the server via HTTP requests.

## 🛠 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** Redis (Upstash)
* **Security:** Client-side AES encryption
* **Deployment:** Vercel (Frontend), Render (Backend)

## ⚙️ How it Works

1.  **Alice** types a secret message.
2.  The browser generates a random key and encrypts the message locally.
3.  The encrypted message is sent to the API; the key remains with Alice.
4.  The API stores the encrypted data in Redis and returns an ID.
5.  Alice shares the generated link: `https://app.com/secret/ID#KEY`.
6.  **Bob** clicks the link. The browser requests the data using the ID.
7.  The server returns the encrypted data and **deletes it immediately**.
8.  Bob's browser uses the `#KEY` from the URL to decrypt and display the message.

## 📦 Installation

```bash
# Clone the repository
git clone [https://github.com/your-username/zero-knowledge-vault.git](https://github.com/your-username/zero-knowledge-vault.git)

# Install Backend
cd servers
npm install
npm run dev

# Install Frontend
cd ../client
npm install
npm run dev

## Created by Settawut Morkrng - A Full Stack Developer passionate about Cybersecurity.
