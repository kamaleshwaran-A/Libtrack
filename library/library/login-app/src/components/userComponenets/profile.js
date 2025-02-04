import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        rollNumber: "",
        department: "",
    });
    const [totalFine, setTotalFine] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserInfo(userData);

                    setFormData({
                        name: userData.name || "",
                        rollNumber: userData.rollNumber || "",
                        department: userData.department || "",
                    });

                    const borrowedBooksCollection = collection(db, "borrowedBooks", user.uid, "books");
                    const borrowedBooksSnapshot = await getDocs(borrowedBooksCollection);
                    const booksList = borrowedBooksSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setBorrowedBooks(booksList);
                    await calculateTotalFine(booksList);
                } else {
                    console.error("User document does not exist");
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const calculateTotalFine = async (books) => {
        let total = 0;
        const currentDate = new Date();

        for (const book of books) {
            const returnDate = new Date(book.returnDate);
            const daysOverdue = Math.ceil((currentDate - returnDate) / (1000 * 3600 * 24));

            if (daysOverdue > 0) {
                const fine = daysOverdue * 5; // Fine is ₹5 per day
                total += fine;
                book.fine = fine;

                // Update fine in Firestore
                const user = auth.currentUser;
                if (user) {
                    const bookDocRef = doc(db, "borrowedBooks", user.uid, "books", book.id);
                    await updateDoc(bookDocRef, { fine });
                }
            } else {
                book.fine = 0;

                // Reset fine in Firestore if no overdue
                const user = auth.currentUser;
                if (user) {
                    const bookDocRef = doc(db, "borrowedBooks", user.uid, "books", book.id);
                    await updateDoc(bookDocRef, { fine: 0 });
                }
            }
        }

        setTotalFine(total);
    };

    const handleExtendReturnDate = async (bookId) => {
        const user = auth.currentUser;
        if (user) {
            const bookDocRef = doc(db, "borrowedBooks", user.uid, "books", bookId);
            const bookDoc = await getDoc(bookDocRef);

            if (bookDoc.exists()) {
                const bookData = bookDoc.data();
                const newReturnDate = new Date(bookData.returnDate);
                newReturnDate.setDate(newReturnDate.getDate() + 7); // Extend by 7 days

                await updateDoc(bookDocRef, { returnDate: newReturnDate.toISOString().split("T")[0] });
                setBorrowedBooks(prevBooks => prevBooks.map(book =>
                    book.id === bookId ? { ...book, returnDate: newReturnDate.toISOString().split("T")[0] } : book
                ));
                await calculateTotalFine(borrowedBooks); // Recalculate total fine after date extension
            }
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            try {
                await updateDoc(userDocRef, {
                    name: formData.name,
                    rollNumber: formData.rollNumber,
                    department: formData.department,
                });
                setUserInfo({ ...userInfo, ...formData });
                setEditMode(false);
            } catch (error) {
                console.error("Error updating profile: ", error);
            }
        }
    };

    const handleReturnBook = async (bookId) => {
        const user = auth.currentUser;

        if (user) {
            try {
                const borrowedBook = borrowedBooks.find(book => book.id === bookId);
                if (!borrowedBook) return;

                const bookDocRef = doc(db, "borrowedBooks", user.uid, "books", bookId);
                await deleteDoc(bookDocRef); // Remove from borrowedBooks collection

                const bookDocRefToUpdate = doc(db, "books", borrowedBook.bookId);
                const bookDoc = await getDoc(bookDocRefToUpdate);
                if (bookDoc.exists()) {
                    const bookData = bookDoc.data();
                    await updateDoc(bookDocRefToUpdate, {
                        noOfBooks: (bookData.noOfBooks || 0) + 1 // Increment available books
                    });
                }

                setBorrowedBooks(prevBooks => prevBooks.filter(book => book.id !== bookId)); // Update local state
                await calculateTotalFine(borrowedBooks); // Recalculate total fine
            } catch (error) {
                console.error("Error returning book: ", error);
            }
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center">User Profile</h1>
            {userInfo ? (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            {editMode ? (
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Roll Number:</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Department:</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h5><strong>Name:</strong> {userInfo.name}</h5>
                                    <p><strong>Roll Number:</strong> {userInfo.rollNumber}</p>
                                    <p><strong>Department:</strong> {userInfo.department}</p>
                                    <p><strong>Total Fine:</strong> ₹{totalFine}</p>
                                    <button className="btn btn-warning" onClick={handleEditClick}>Edit Profile</button>
                                </>
                            )}
                        </div>
                    </div>

                    <h3 className="mt-4">Borrowed Books</h3>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Book Name</th>
                            <th>Entry Date</th>
                            <th>Return Date</th>
                            <th>Fine</th>
                            <th>Actions</th>
                            <th>Extend Return Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {borrowedBooks.map(book => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.EntryDate}</td>
                                <td>{book.returnDate}</td>
                                <td>₹{book.fine || 0}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleReturnBook(book.id)}
                                        disabled={book.fine > 0} // Disable if fine is greater than 0
                                    >
                                        Return
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleExtendReturnDate(book.id)}
                                        disabled={book.fine > 0} // Disable if fine is greater than 0
                                    >
                                        Extend 7 Days
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Profile; 