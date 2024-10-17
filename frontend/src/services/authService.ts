import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = process.env.REACT_APP_BASE_URL;

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

export const validateSession = async () => {
  try {
    const authToken = Cookies.get("authToken");
    const response = await axios.get(`${baseUrl}/auth`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during :", error);
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
