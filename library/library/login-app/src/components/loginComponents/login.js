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

    const staticBackgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #4a90e2, #50e3c2, #9013fe, #ff0080)",
        zIndex: -1,
    };

    const cardContentStyle = {
        width: "100%",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid #ccc",
        borderRadius: "5px",
        overflow: "hidden",
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div style={staticBackgroundStyle}></div>

            <div className="card shadow-lg p-4" style={{ maxWidth: "900px", width: "100%", borderRadius: "10px" }}>
                <div className="row">
                    <div className="col-md-6 d-flex flex-column align-items-center">
                        <h2 className="text-center mb-4">Login</h2>
                        <form onSubmit={handleLogin} style={{ width: "100%" }}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Loading..." : "Login"}
                            </button>
                            {error && <p className="text-danger mt-3 text-center">{error}</p>}
                        </form>
                        <button
                            onClick={() => setIsScanning((prev) => !prev)}
                            className="btn btn-info w-100 mt-3"
                        >
                            {isScanning ? "Stop Scanning" : "Start Scanning"}
                        </button>
                        <p className="mt-3 text-center">
                            Don't have an account?{" "}
                            <button className="btn btn-link" onClick={() => navigate("/register")}>
                                Register here
                            </button>
                        </p>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <div style={cardContentStyle}>
                            {isScanning ? (
                                <div
                                    id="barcode-scanner"
                                    ref={scannerRef}
                                    style={{ width: "100%", height: "100%" }}
                                ></div>
                            ) : (
                                <img
                                    src="https://media.istockphoto.com/id/1498878143/photo/book-stack-and-open-book-on-the-desk-in-modern-public-library.jpg?s=612x612&w=0&k=20&c=vRcxdgfHSFJkow6DNPtaL9DT_ttdMGWel-qRLEzkQEI="
                                    alt="Login Illustration"
                                    className="img-fluid"
                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginWithBarcode;
