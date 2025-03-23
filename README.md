# Lost & Found

A React-Firebase web application connecting people with their lost items. Users can report lost/found items, search via interactive maps, and communicate through secure messaging.

## Features

- **User Authentication**: Secure login/signup system
- **Item Reporting**: Post lost items or register found belongings
- **Interactive Maps**: Location-based item searching and visualization
- **Secure Messaging**: Direct communication between users
- **Real-time Updates**: Instant notifications for matched items
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: UI theme customization

## Technologies Used

- **Frontend**: React.js, TailwindCSS, GSAP Animations
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Maps**: Google Maps API integration
- **State Management**: React Context API
- **Notifications**: React-Toastify
- **Deployment**: Firebase Hosting

## Screenshots

![Login Screen](/screenshots/login.png)
![Dashboard](/screenshots/dashboard.png)
![Item Details](/screenshots/item-details.png)
![Map View](/screenshots/map-view.png)

## Installation and Setup

1. Clone the repository
   ```
   git clone https://github.com/kaushik9701/lost-and-found.git
   cd lost-and-found
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. Start the development server
   ```
   npm start
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context for state management
├── firebase/         # Firebase configuration and utilities
├── pages/            # Application pages
├── assets/           # Images, fonts, and other static files
└── App.js            # Main application component
```

## Future Enhancements

- Email notifications for potential matches
- Advanced filtering options
- User ratings and trust system
- Mobile app version using React Native

## Contact

Kaushik Reddy Bandi
- Email: bandikaushikreddy@gmail.com
- LinkedIn: [kaushik-reddy-bandi](https://www.linkedin.com/in/kaushik-reddy-bandi-1ba624257/)
- GitHub: [kaushik9701](https://github.com/kaushik9701)

## License

This project is licensed under the MIT License - see the LICENSE file for details.