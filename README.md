# LibraSync

## Overview
LibraSync is a comprehensive Library Management System designed to streamline the process of borrowing, returning, and managing books in a library. The system includes QR code scanning to verify user roll numbers and ensures efficient tracking of books. It provides a user-friendly interface for students, librarians, and administrators to manage library operations seamlessly.

## Features
- **Book Borrowing:** Users can borrow books based on availability.
- **Book Returning:** Allows users to return borrowed books and update records.
- **Loan Extension:** Users can request extensions for their borrowed books.
- **QR Code Scanning:** Verifies user roll numbers for authentication.
- **Admin Panel:** Manages book inventory and user records.
- **Real-time Database Updates:** Synchronizes book availability and transactions instantly.
- **Search & Filter:** Users can search for books by title, author, or genre.
- **User Dashboard:** Displays borrowed books, due dates, and fines (if any).
- **Role-based Access Control:** Different features for students, librarians, and admins.
- **Book Reviews and Ratings:** Users can review and rate books.
- **Fine Calculation:** Automatically calculates fines for overdue books.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used
- **Frontend:** React.js, Bootstrap
- **Database & Authentication:** Firebase
- **QR Code Scanner:** Implemented using `html5-qrcode` library
- **Hosting:** GitHub Pages
- **Version Control:** Git

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/ikjasrasool/library.git
   ```
2. Navigate to the project directory:
   ```sh
   cd library
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the `login-app` directory and add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
5. Start the project:
   ```sh
   npm start
   ```

## Usage
- **Students:** Can sign up, log in, borrow books, return books, extend loan periods, and review books.
- **Admins:** Can manage books, view borrowed books, calculate fines, and manage user activities.
- **QR Code Scanning:** Used to verify student roll numbers during login.

## Future Enhancements
- Implement a recommendation system for books.
- Add support for e-books and audiobooks.
- Integrate a notification system for due dates.
- Enhance the admin dashboard with more analytics and reports.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Contact
For any inquiries or support, please contact [ikjasrasool](https://github.com/ikjasrasool).

---

