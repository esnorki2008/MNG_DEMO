import React, { useEffect, useState } from "react"; // Import React and hooks for side effects and state management
import { signup } from "../services/authService"; // Import signup service to handle user registration
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation between routes

const Signup: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate between routes
  const [name, setName] = useState<string>(""); // State to store the first name
  const [familyName, setFamilyName] = useState<string>(""); // State to store the last name
  const [email, setEmail] = useState<string>(""); // State to store the email address
  const [password, setPassword] = useState<string>(""); // State to store the password
  const [error, setError] = useState<string | null>(null); // State to store any signup error messages

  useEffect(() => {
    // Check if user is already logged in
    const authToken = Cookies.get("authToken");
    // Get auth token from cookies
    if (authToken) {
      navigate("/dashboard");
      // If user is logged in, redirect to the dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Handle form submission
    e.preventDefault(); // Prevent the form from reloading the page
    setError(null); // Clear any previous errors

    try {
      const result = await signup({ name, familyName, email, password });
      // Call the signup service with form data
      if (result.authToken) {
        Cookies.set("authToken", result.authToken, { expires: 7 });
        // If signup is successful, store the auth token in cookies for 7 days
      }
      navigate("/dashboard");
      // Redirect to the dashboard after signup
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      // Show an error message if signup fails
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      {/* Outer container with styling */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {/* Inner card containing the signup form */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create your account
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* Display error message if present */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Signup form */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // Update first name in state
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="familyName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              // Update last name in state
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Update email in state
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="john.doe@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Update password in state
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="P@ssw0rd123!"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
          {/* Submit button */}
        </form>

        {/* Button to navigate to the login page */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            // Navigate to the login page
            className="mt-2 py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
// Export the Signup component
