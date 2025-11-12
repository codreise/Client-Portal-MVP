import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  // При завантаженні програми читаємо дані з localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setAuth({
        token: savedToken,
        user: JSON.parse(savedUser),
      });
    }
  }, []);

  // Функція для входу
  function handleAuth(token, user) {
    setAuth({ token, user });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Функція для виходу
  function handleLogout() {
    setAuth({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <>
      {!auth.token ? (
        <AuthForm onAuth={handleAuth} />
      ) : (
        <Dashboard user={auth.user} onLogout={handleLogout} />
      )}
    </>
  );
}