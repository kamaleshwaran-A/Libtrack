import React, { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [batch, setBatch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                name,
                role: "student",
                rollNumber,
                department,
                batch,
                createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, "users", user.uid), userData);
            navigate("/login");
        } catch (error) {
            setError(error.message);
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
                                {/* Left Side - Library Image */}
                                <div className="col-md-6 d-none d-md-block position-relative p-0">
                                    <div
                                        className="h-100 w-100 position-relative"
                                        style={{
                                            borderRadius: "16px 0 0 16px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                            alt="Books on shelf"
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
                                            <p className="mb-0">Join our digital library community</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Registration Form */}
                                <div className="col-md-6">
                                    <div className="card-body p-4 p-lg-5">
                                        <div className="text-center mb-4">
                                            <div className="d-flex align-items-center justify-content-center mb-2">
                                                <i className="bi bi-person-plus-fill fs-3 me-2 text-primary"></i>
                                                <h2 className="fw-bold mb-0">Create Account</h2>
                                            </div>
                                            <p className="text-muted">Register to access LibraSync</p>
                                        </div>

                                        <form onSubmit={handleRegister}>
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-person text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control border-start-0 bg-light"
                                                        placeholder="Full Name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-envelope text-muted"></i>
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

                                            <div className="mb-3">
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

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-credit-card text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control border-start-0 bg-light"
                                                        placeholder="Roll Number"
                                                        value={rollNumber}
                                                        onChange={(e) => setRollNumber(e.target.value.toLowerCase())}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-building text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control border-start-0 bg-light"
                                                        placeholder="Department"
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-calendar3 text-muted"></i>
                                                    </span>
                                                    <select
                                                        className="form-select border-start-0 bg-light"
                                                        value={batch}
                                                        onChange={(e) => setBatch(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Batch Year</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                        <option value="2027">2027</option>
                                                        <option value="2028">2028</option>
                                                    </select>
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
                                                    <><i className="bi bi-check-circle-fill me-2"></i>Create Account</>
                                                )}
                                            </button>

                                            {error && (
                                                <div className="alert alert-danger mt-3 text-center" role="alert">
                                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                    {error}
                                                </div>
                                            )}
                                        </form>

                                        <div className="text-center mt-3">
                                            <p className="mb-0 text-muted">
                                                Already have an account?{" "}
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => navigate("/login")}
                                                >
                                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                                    Sign In
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

export default Register;