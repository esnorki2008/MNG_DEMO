import { useState, useEffect } from "react";
import { AuthToken } from "../models/auth";
import { validateSession } from "../services/authService";

export const useValidateSessionHook = () => {
  const [session, setState] = useState<AuthToken | null>(null);
  const [sessionLoading, setLoading] = useState<boolean>(true);
  const [sessionError, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await validateSession();
        setState(data);
      } catch (err) {
        setError("Failed to fetch .");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { session, sessionLoading, sessionError };
};
