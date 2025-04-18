// LoginWithBarcode.js
import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { browserLocalPersistence } from "firebase/auth";
import { Html5Qrcode } from "html5-qrcode";

const LoginWithBarcode = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);
    const html5QrcodeScanner = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    useEffect(() => {
        if (isScanning) {
            html5QrcodeScanner.current = new Html5Qrcode("barcode-scanner");
            html5QrcodeScanner.current.start(
                { facingMode: "environment" },
                { fps: 20, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    console.log(`Scanned Barcode (Roll Number): ${decodedText}`);
                    fetchEmailFromRollNumber(decodedText);
                    setIsScanning(false);
                },
                (errorMessage) => console.warn(`Scan failed: ${errorMessage}`)
            ).catch((error) => {
                console.error("Failed to start the scanner:", error);
                setIsScanning(false);
            });
        }

        return () => {
            if (html5QrcodeScanner.current && isScanning) {
                html5QrcodeScanner.current.stop().then(() => {
                    html5QrcodeScanner.current.clear();
                }).catch((err) => console.warn("Scanner stop error:", err));
            }
        };
    }, [isScanning]);

    const fetchEmailFromRollNumber = async (scannedRollNumber) => {
        const normalizedRollNumber = scannedRollNumber.trim().toLowerCase();
        try {
            const usersCollectionRef = collection(db, "users");
            const q = query(usersCollectionRef, where("rollNumber", "==", normalizedRollNumber));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                const { email, role } = userData;

                if (role === "admin" || role === "student") {
                    setEmail(email);
                    console.log(`Email for roll number ${scannedRollNumber}: ${email}`);
                } else {
                    setError("User role is not recognized.");
                }
            } else {
                setError("No user found for the scanned roll number.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch user from the database.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await auth.setPersistence(browserLocalPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const { role } = userDoc.data();
                localStorage.setItem("userRole", role);

                if (role === "admin") {
                    navigate("/home", { replace: true });
                } else if (role === "student") {
                    navigate("/student-home", { replace: true });
                } else {
                    setError("User role not defined.");
                }
            } else {
                setError("User data not found.");
            }
        } catch (error) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
            {/* Library-themed Background */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{
                    background: "linear-gradient(rgba(30, 50, 70, 0.8), rgba(30, 50, 70, 0.9)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1
                }}
            ></div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-lg border-0 overflow-hidden"
                            style={{
                                borderRadius: "16px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(10px)"
                            }}>
                            <div className="row g-0 h-100">
                                {/* Left Side - Library Image or Scanner */}
                                <div className="col-md-6 d-none d-md-block position-relative p-0">
                                    <div
                                        className="h-100 w-100 position-relative"
                                        style={{
                                            borderRadius: "16px 0 0 16px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {isScanning ? (
                                            <div
                                                id="barcode-scanner"
                                                ref={scannerRef}
                                                className="position-relative w-100 h-100 d-flex justify-content-center align-items-center"
                                                style={{
                                                    zIndex: 2,
                                                    backgroundColor: "#1a2530"
                                                }}
                                            >
                                                <div className="text-center text-white position-absolute top-0 mt-4">
                                                    <i className="bi bi-qr-code-scan fs-1 mb-2"></i>
                                                    <h3>Scanning ID Card</h3>
                                                    <p>Please position your ID card's barcode in the frame</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <img
                                                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                                    alt="Library shelves"
                                                    className="h-100 w-100"
                                                    style={{
                                                        objectFit: "cover",
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0
                                                    }}
                                                />
                                                <div
                                                    className="position-absolute top-0 left-0 w-100 h-100"
                                                    style={{
                                                        background: "linear-gradient(135deg, rgba(76, 57, 38, 0.7), rgba(36, 62, 99, 0.8))",
                                                        zIndex: 1
                                                    }}
                                                ></div>
                                                <div className="position-absolute w-100 text-center text-white p-4"
                                                    style={{
                                                        bottom: 0,
                                                        zIndex: 2,
                                                        background: "linear-gradient(transparent, rgba(0,0,0,0.7))"
                                                    }}>
                                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                                        <i className="bi bi-book-half fs-3 me-2"></i>
                                                        <h1 className="display-6 mb-0">LibraSync</h1>
                                                    </div>
                                                    <p className="mb-0">Your digital library management system</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side - Login Form */}
                                <div className="col-md-6">
                                    <div className="card-body p-4 p-lg-5">
                                        <div className="text-center mb-4">
                                            <div className="d-flex align-items-center justify-content-center mb-2">
                                                <i className="bi bi-book-half fs-3 me-2 text-primary"></i>
                                                <h2 className="fw-bold mb-0">Welcome Back</h2>
                                            </div>
                                            <p className="text-muted">Sign in to access your account</p>
                                        </div>

                                        <form onSubmit={handleLogin}>
                                            <div className="mb-4">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className="form-control border-start-0 bg-light"
                                                        placeholder="Email Address"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-lock text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="password"
                                                        className="form-control border-start-0 bg-light"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 py-2 mb-3"
                                                disabled={loading}
                                                style={{
                                                    backgroundColor: "#2C3E50",
                                                    borderColor: "#2C3E50",
                                                    transition: "all 0.3s"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#1a2530";
                                                    e.currentTarget.style.borderColor = "#1a2530";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#2C3E50";
                                                    e.currentTarget.style.borderColor = "#2C3E50";
                                                }}
                                            >
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setIsScanning((prev) => !prev)}
                                                className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    transition: "all 0.3s"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "";
                                                }}
                                            >
                                                <i className={`bi ${isScanning ? "bi-x-circle" : "bi-qr-code-scan"} me-2`}></i>
                                                {isScanning ? "Stop ID Card Scan" : "Scan ID Card"}
                                            </button>

                                            {error && (
                                                <div className="alert alert-danger mt-3 text-center" role="alert">
                                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                    {error}
                                                </div>
                                            )}
                                        </form>

                                        <div className="text-center mt-4">
                                            <p className="mb-0 text-muted">
                                                Don't have an account?{" "}
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => navigate("/register")}
                                                >
                                                    <i className="bi bi-person-plus me-1"></i>
                                                    Register
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-3 text-white">
                            <small>&copy; {new Date().getFullYear()} LibraSync. All rights reserved.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginWithBarcode;