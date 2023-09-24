# OLA-3 Travel Destination

Repository link - https://github.com/Caro8866/OLA-3_Travel-Destinations_pt-1

This project was about creating a simple web application to record and view travel destinations. We used NodeJs/Express for the backend, MongoDB for the database, and vanilla JavaScript for the frontend. This project taught us how to work with having server side code and client side code.

## Features

- Record your travel destinations with details such as:
  - Country
  - Destination Name
  - Link (Optional)
  - Arrival Date (Optional)
  - Departure Date (Optional)
  - Description (Optional)
  - Image (JPG, JPEG, PNG formats supported) (Optional)
- View a list of recorded travel destinations.
- All data is persisted in a MongoDB database.

## Technical Overview

### Frontend

- Pure vanilla JavaScript.
- Two main client-side scripts:
  - **add.js**: For adding a new desctination form validation and form submission.
  - **readFormData.js**: For fetching and displaying saved travel destinations.
- Form validation checks:
  - Required fields
  - Valid country names
  - Valid URLs
  - Image format checks
  - Date consistency checks
- Images are converted to Base64 format and stored as strings directly in MongoDB. (This does limit the image file size to around maximum 50kb )

### Backend

- Built with **Node.js** and **Express.js**.
- Uses **MongoDB** with **MongoClient** for data persistence.
- Provides two primary routes:
  - `GET /destinations`: Fetch all travel destinations.
  - `POST /destinations`: Add a new travel destination.

## Prerequisites

- Node.js and npm.
- MongoDB server running locally.

## Installation

1. Clone the repository:
   `git clone [repository_url]`

2. Navigate to the project directory:
   `cd `

3. Install the necessary packages:
   `npm install`

4. Start the server:
   `node scripts/api/server.js`

5. Start live-server

7. Open your browser and navigate to:
   http://127.0.0.1:5500/

## Usage

- After setting up the project, start live-server, open your browser and go to http://127.0.0.1:5500/ to view recorded travel destinations.
- To add a new entry, navigate to http://127.0.0.1:5500/add.html and fill out the form with your travel details.

## Contributers

- Fryderyk Boncler - [https://github.com/relcnob]
- George Nicolae - [https://github.com/ngeorge07]
- Caroline Thostrup - [https://github.com/caro8866]

## License

This is a school project.
