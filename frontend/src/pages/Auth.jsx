import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log("LOGIN SUCCESS:", data);

            localStorage.setItem("token", data.token);

            navigate("/dashboard"); // 🔥 WORKS
        },
        onError: (err) => {
            console.error("LOGIN ERROR:", err);
            alert(err.response?.data?.message || "Login failed");
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            alert("Registered successfully 🎉");
            setIsLogin(true);
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Register failed");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            loginMutation.mutate({
                email: form.email,
                password: form.password,
            });
        } else {
            registerMutation.mutate(form);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? "Login" : "Create Account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            className="w-full border px-4 py-2 rounded-md"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                        />
                    )}

                    <input
                        type="email"
                        className="w-full border px-4 py-2 rounded-md"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

                    <input
                        type="password"
                        className="w-full border px-4 py-2 rounded-md"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loginMutation.isLoading || registerMutation.isLoading}
                        className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
                    >
                        {loginMutation.isLoading || registerMutation.isLoading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Register"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-600 font-medium"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth;
