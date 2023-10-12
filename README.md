# OLA-4 Travel Destination (Part 2)

Repository link - https://github.com/Caro8866/OLA-3_Travel-Destinations_pt-2

This project focuses on creating a web application designed for recording and viewing travel destinations. Initially started as a simple NodeJs/Express backend with MongoDB and vanilla JavaScript frontend, the application was later extended to incorporate Mongoose, bcrypt, JSON Web Tokens, dotenv, and Passport. This enhancement improved database interactions, enabled secure user authentication, and streamlined environment variable management.

The learning curve involved learning about and using server-side and client-side coding practices, understanding REST principles, and implementing functionalities like authentication and data persistence.

## Table of Contents

- [Features](#features)
- [Technical Overview](#technical-overview)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)


## Features

- Record, view, update, and delete travel destinations with various details like country, dates, etc.
- User authentication via JWT
- Role-based access controls
- Data persistence in MongoDB
- Frontend in Vanilla JavaScript
- Backend API built using Node.js, Express.js, and Mongoose
- Data validation on frontend and backend
- Dynamic UI updates without requiring page refreshes

## Technical Overview

### Frontend

- Implemented in pure Vanilla JavaScript.
- **Client-side scripts:**
  - **add.js**: Adding new destinations, form validation, and submission.
  - **readFormData.js**: Fetching and displaying saved travel destinations.
  - **authforms.js**: Manages the authentication forms.
  - **update.js**: Updates existing travel destinations.
  - **toaster.js**: User notifications.
  - **imageUtilities.js**: Image compression and Base64 conversion.
  - **modal.js**: Deletion modal.

- **External Libraries**:
  - **`browser-image-compression`**: For image compression. Imported from Skypack CDN.

- Form validation checks:
  - Required fields
  - Valid country names
  - Valid URLs
  - Image format checks
  - Date consistency checks
- Images are converted to Base64 format and stored as strings directly in MongoDB. (This does limit the image file size to around maximum 50kb )


### Backend

- Built with **Node.js** and **Express.js**.
- Uses **MongoDB** with **Mongoose** for data modeling, validation and persistence.
- Provides RESTful routes for CRUD operations and User Authentication:
  - `GET /destinations: Fetches all travel destinations from the database.
  - POST /destinations: Adds a new travel destination to the database.
  - GET /destinations/:id: Retrieves a specific travel destination by its ID.
  - PUT /destinations/:id: Updates a specific travel destination by its ID.
  - DELETE /destinations/:id: Deletes a specific travel destination by its ID.
  - POST /auth/login: Handles user login.
  - POST /auth/signup: Handles user registration.

- **Security and Authentication**  
  - bcrypt for password hashing
  - JSON Web Tokens for authentication
  - Passport.js with JwtStrategy
  - dotenv for environment variable management

## Prerequisites

- Node.js
- npm
- MongoDB server running locally.
- Mongoose package.

## Installation

1. Clone the repository:
   `git clone [(https://github.com/Caro8866/OLA-3_Travel-Destinations_pt-1.git)]`
  
2. Navigate to the project directory:
   `cd [OLA-3_Travel-Destinations_pt-1]`

3. Install the necessary packages:
   `npm install`
4. Set up `.env` file using the `.env template` file

5. Start the server:
   `node scripts/api/server.js`
   
6. Start live-server:
   `live-server`

7. Open your browser and navigate to:
   http://127.0.0.1:5500/


## Usage

- Open browser and go to http://127.0.0.1:5500/ to view destinations.
- To add a new entry, go to http://127.0.0.1:5500/add.html.


## Contributors

| Contributor       | GitHub Profile                                              | Profile Picture                                                       |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Fryderyk Boncler   | [Fryderyk Boncler](https://github.com/relcnob)               | <img src="https://github.com/relcnob.png?size=80" alt="Fryderyk Boncler">  |
| George Nicolae    | [George Nicolae](https://github.com/ngeorge07)               | <img src="https://github.com/ngeorge07.png?size=80" alt="George Nicolae">  |
| Caroline Thostrup | [Caroline Thostrup](https://github.com/caro8866)             | <img src="https://github.com/caro8866.png?size=80" alt="Caroline Thostrup"> |



## License

This is a school project.
