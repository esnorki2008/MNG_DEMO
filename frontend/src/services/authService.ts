import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const signup = async ({
  name,
  familyName,
  email,
  password,
}: {
  name: string;
  familyName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${baseUrl}/signup`, {
      name,
      familyName,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
