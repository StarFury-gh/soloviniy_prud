import { useState } from "react";
import { Link } from "react-router-dom";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

import { Button, Input } from "../common";
import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");

  const [loginError, setLoginError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError("Заполните все поля");
      return;
    }
    setLoginError("");
    const url = `${API_URL}/users/register`;
    const body = JSON.stringify({ email, password, name, surname });
    console.log(body);
    const response = await fetch(url, {
      method: "POST",
      body,
      headers: { "Content-type": "application/json" },
    });
    if (response.ok) {
      const { access_token } = await response.json();
      localStorage.setItem(LS_ACCESS_TOKEN, access_token);
      setMessage("Вы успешно зарегистрировали аккаунт!");
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2500);
    } else {
      setLoginError("Ошибка при авторизации.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}>
            <span className={styles.authIcon}>СП</span>
            <h2 className={styles.authTitle}>Регистрация</h2>
            <p className={styles.authSubtitle}>
              Создайте аккаунт, чтобы добавлять истории, фотографии и сообщать о
              проблемах
            </p>
          </div>
          <div className={styles.authForm}>
            <p>{message}</p>
            <Input
              type="email"
              label="Электронная почта"
              placeholder="volunteer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Пароль"
              placeholder="- - - - - - - -"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={loginError}
              required
            />
            <Input
              type="text"
              label="Ваша фамилия"
              placeholder="Иванов"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <Input
              type="text"
              label="Ваше имя"
              placeholder="Иван"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button variant="primary" fullWidth onClick={handleLogin}>
              Зарегистрироваться
            </Button>
            <div className={styles.authDivider}>или</div>

            <p className={styles.authNote}>
              УЖе есть аккаунт?{" "}
              <b>
                <Link className={styles.authNoteLink} to="/login">
                  Войдите
                </Link>
              </b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
