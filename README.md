
# ♻️ RecycleTrack

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://img.shields.io/badge/build-passing-brightgreen.svg)

A web application to facilitate the recycling process by connecting users, middleman and recycling companies.

## Features

*   **👤 User Management**: User registration and login for both clients and delivery partners.
*   **🗑️ Item Tracking**: Clients can add recyclable items with scheduled dates and location.
*   **🗺️ Location Services**: Integration with map services to capture item location during submission.
*   **🚚 Delivery Partner**: Delivery partners can view available and assigned recycling jobs.
*   **🤝 Payment Forwarding**: ETH payment forwarding between clients and delivery partners using smart contracts.
*   **✅ Item Verification**: Delivery partners can mark items as verified in the system.
*   **📊 Dashboard**: Dedicated dashboards for clients and delivery partners.

## Tech Stack

| Category     | Technologies                                                                 |
|--------------|------------------------------------------------------------------------------|
| Frontend     | React [React Docs][react-url], React Router [React Router Docs][react-router-url], Vite [Vite Docs][vite-url], Leaflet [Leaflet Docs][leaflet-url] |
| Backend      | Node.js [Node.js Docs][nodejs-url], Express [Express][express-url], Mongoose [Mongoose Docs][mongoose-url]  |
| Database     | MongoDB [MongoDB Docs][mongodb-url]                                          |
| Blockchain   | Solidity [Solidity Docs][solidity-url], Hardhat [Hardhat Docs][hardhat-url], Ethers.js [Ethers.js Docs][ethers-url]              |
| Other        | Axios [Axios Docs][axios-url], Cors [Cors Docs][cors-url], Dotenv [Dotenv Docs][dotenv-url]                  |

## Quick Start

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v9 or higher) or yarn (v1.22 or higher)
*   MongoDB (running locally or accessible via URI)
*   Metamask browser extension installed

### Installation

bash
# Clone the repository
git clone [repo-url]

# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install
# or
yarn install

# Navigate to the client directory
cd ../client

# Install client dependencies
npm install
# or
yarn install

# Navigate to the blockchain directory
cd ../blockchain

# Install blockchain dependencies
npm install
# or
yarn install


### Environment

Create `.env` file in the `backend` directory and define the following environment variables:

env
PORT=3000
DB_URI=mongodb://localhost:27017/Recycle


## Development

### Commands

bash
# Start backend development server
cd backend
npm run start
# or
yarn start

# Start frontend development server
cd client
npm run dev
# or
yarn dev


### Testing

The project uses a combination of testing strategies.  Further details on backend tests will be added later.

## API Reference

| Method | Endpoint               | Body                                      | Response                   |
|--------|------------------------|-------------------------------------------|----------------------------|
| POST   | /api/user/add-item      | { userId, type, quantity, scheduledDate, lat, long }  | 200 OK (Item added message) |
| POST   | /api/login             | { phone, password, role }                 | 200 OK (User/Middleman data)|
| POST   | /api/middleman/assign-item| {middlemanId, itemId}                         | 200 OK (Success message)   |
| GET   | /api/user/items/:userId              |                                   | 200 OK (Items array)|
| POST   | /api/middleman/assigned-items         | {id}                                          | 200 OK (Items array)        |
| POST   | /api/middleman/verify-item        | {itemId}                                          | 200 OK (Success message)         |
| POST   | /api/middleman/update-payment        | {itemId}                                          | 200 OK (Success message)         |
| GET   | /api/middleman/available-items              |                                   | 200 OK (available items array)|

## Deployment

### Dockerfile (Example)

dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend code
COPY backend ./backend
WORKDIR /app/backend
RUN npm install

WORKDIR /app

# Copy client code
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Production environment
FROM node:18-alpine

WORKDIR /app

# Copy backend code
COPY --from=0 /app/backend ./backend
WORKDIR /app/backend
COPY --from=0 /app/client/dist ./client/dist

CMD ["node", "index.js"]


### Platform Guides

*   **Vercel**: Follow the [Vercel Deployment Guide][vercel-url] for deploying the frontend.
*   **Heroku**: Refer to the [Heroku Node.js Deployment Guide][heroku-url] for deploying the backend.
*   **AWS**: Use [AWS Elastic Beanstalk][aws-beanstalk-url] or [AWS EC2][aws-ec2-url] for deployment.

## Contributing

We welcome contributions to RecycleTrack! Please follow these guidelines:

*   **Branch Naming**: `feat/new-feature`, `bugfix/issue-description`, `chore/refactor-code`
*   **Commit Messages**: Use imperative mood: "Fix bug" instead of "Fixed bug" or "Fixes bug."
*   **Pull Requests**: Submit a PR against the `main` branch with a clear description of the changes and related issue(s).

> [!NOTE]
> Ensure all tests pass before submitting a pull request.

[nodejs-url]: https://nodejs.org/en/docs/
[express-url]: https://expressjs.com/en/4x/api.html
[mongodb-url]: https://www.mongodb.com/docs/
[mongoose-url]: https://mongoosejs.com/docs/
[react-url]: https://react.dev/reference/react
[react-router-url]: https://reactrouter.com/en/main/start/tutorial
[vite-url]: https://vitejs.dev/guide/
[hardhat-url]: https://hardhat.org/
[ethers-url]: https://docs.ethers.io/v5/
[axios-url]: https://axios-http.com/docs/intro
[vercel-url]: https://vercel.com/docs
[heroku-url]: https://devcenter.heroku.com/categories/nodejs
[aws-beanstalk-url]: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html
[aws-ec2-url]: https://docs.aws.amazon.com/ec2/
[solidity-url]: https://docs.soliditylang.org/en/v0.8.24/
[leaflet-url]: https://leafletjs.com/reference.html
[cors-url]: https://github.com/expressjs/cors
[dotenv-url]: https://github.com/motdotla/dotenv
