
Rentify - Property Rental Platform

Rentify is a comprehensive property rental platform that connects property owners with potential tenants. The application provides a seamless experience for both parties, allowing owners to list their properties and tenants to browse and express interest in available rentals.

## Screenshots

![Landing page](![image](https://github.com/user-attachments/assets/338e86b6-17dc-4994-957c-1934597d6b39)
![Select Cities](https://github.com/Gautamkr-10/Rentifyhouse/blob/a4278a6dfbdd0b45b1f32a62f628cb207f92a88b/Screenshot%202025-04-04%20122539.png)
![Property List](https://github.com/Gautamkr-10/Rentifyhouse/blob/a4278a6dfbdd0b45b1f32a62f628cb207f92a88b/Screenshot%202025-04-04%20125448.png)


## Features
### For Property Owners

1. Log in to your account
2. Navigate to "Add Property" to create a new listing
3. Fill in property details including title, description, location, price, etc.
4. Upload property images
5. Submit the form to publish your listing
6. View interested buyers from your dashboard


### For Tenants

1. Log in to your account
2. Browse available properties
3. Use filters to narrow down your search
4. Click on a property to view details
5. Like properties to save them for later
6. Express interest to contact the owner


## Project Structure
```plaintext
rentify/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── README.md
```
## Tech Stack
### Frontend
- React.js
- React Router for navigation
- Framer Motion for animations
- React Icons
- Axios for API requests
- React Hot Toast for notifications
- CSS3 with custom animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password hashing



## Installation
1. Install backend dependencies


```shellscript
cd backend
npm install
```

2. Install frontend dependencies


```shellscript
cd ../frontend
npm install
```
3. Create a `.env` file in the backend directory with the following variables:


```plaintext
PORT=your_port
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
```
4. Start the backend server


```shellscript
cd backend
npm start
```

5. Start the frontend development server


```shellscript
cd frontend
npm run dev
```
Open your browser and navigate to `http://localhost:5173`

### Setup Instructions

. Clone the repository
```bash
git clone https://github.com/yourusername/rentifyhouse.git
cd rentifyhouse
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGODB_URI`

`JWT_SECRET`


## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Acknowledgements

 - [React](https://reactjs.org/)
 - [Node.js](https://nodejs.org/)
 - [MONGODB.js](https://www.mongodb.com/)
 - [Express.js](https://expressjs.com/)
 - [Framer Motion.js](https://www.framer.com/motion/)



## Contributors
- [Gautam Kumar](https://github.com/Gautamkr-10)
