import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

const AdminBorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            const borrowedBooksData = [];

            try {
                // Get all users' borrowed books
                const usersSnapshot = await getDocs(collection(db, "users"));
                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const userData = userDoc.data();

                    const booksSnapshot = await getDocs(collection(db, "borrowedBooks", userId, "books"));
                    booksSnapshot.forEach((bookDoc) => {
                        const bookData = bookDoc.data();
                        borrowedBooksData.push({
                            ...bookData,
                            userId,
                            userName: userData.name,
                            userRollNumber: userData.rollNumber,
                            userBatch: userData.batch,
                            userEmail: userData.email,
                            bookId: bookDoc.id, // Save the document ID for future reference
                        });
                    });
                }
                setBorrowedBooks(borrowedBooksData);
                setFilteredBooks(borrowedBooksData); // Initially show all books
            } catch (error) {
                console.error("Error fetching borrowed books: ", error);
            }
        };

        fetchBorrowedBooks();
    }, []);

    // Filter books based on search query
    useEffect(() => {
        const filtered = borrowedBooks.filter(book => {
            const queryLower = searchQuery.toLowerCase();
            const nameMatch = (book.userName || "").toLowerCase().includes(queryLower);
            const rollNumberMatch = (book.userRollNumber || "").toLowerCase().includes(queryLower);
            const batchMatch = (book.userBatch || "").toLowerCase().includes(queryLower);

            return nameMatch || rollNumberMatch || batchMatch;
        });
        setFilteredBooks(filtered);
    }, [searchQuery, borrowedBooks]);

    const handleReturnBook = async (userId, bookId) => {
        try {
            // Delete the borrowed book document
            const bookDocRef = doc(db, "borrowedBooks", userId, "books", bookId);
            await deleteDoc(bookDocRef);

            // Update local state to remove the returned book
            setFilteredBooks((prevBooks) => prevBooks.filter(book => book.bookId !== bookId));
            alert("Book returned successfully.");
        } catch (error) {
            console.error("Error returning book: ", error);
        }
    };

    const handleExtendReturnDate = async (userId, bookId, currentReturnDate) => {
        try {
            // Extend the return date by 7 days
            const bookDocRef = doc(db, "borrowedBooks", userId, "books", bookId);
            const newReturnDate = new Date(currentReturnDate);
            newReturnDate.setDate(newReturnDate.getDate() + 7); // Extend by 7 days

            // Update the return date in Firestore
            await updateDoc(bookDocRef, { returnDate: newReturnDate.toISOString().split("T")[0] });

            // Update local state to reflect the new return date
            setFilteredBooks((prevBooks) => prevBooks.map(book =>
                book.bookId === bookId ? { ...book, returnDate: newReturnDate.toISOString().split("T")[0] } : book
            ));
            alert("Return date extended successfully.");
        } catch (error) {
            console.error("Error extending return date: ", error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center">All Borrowed Books</h1>

            {/* Single search bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name, Roll Number, or Batch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>User Name</th>
                    <th>Roll Number</th>
                    <th>Batch</th>
                    <th>Book Title</th>
                    <th>Entry Date</th>
                    <th>Return Date</th>
                    <th>Fine</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredBooks.map((book) => (
                    <tr key={book.bookId}>
                        <td>{book.userName}</td>
                        <td>{book.userRollNumber}</td>
                        <td>{book.userBatch}</td>
                        <td>{book.title}</td>
                        <td>{book.EntryDate}</td>
                        <td>{book.returnDate}</td>
                        <td>₹{book.fine || 0}</td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleReturnBook(book.userId, book.bookId)}
                            >
                                Return
                            </button>
                            <button
                                className="btn btn-info ms-2"
                                onClick={() => handleExtendReturnDate(book.userId, book.bookId, book.returnDate)}
                            >
                                Extend 7 Days
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBorrowedBooks;