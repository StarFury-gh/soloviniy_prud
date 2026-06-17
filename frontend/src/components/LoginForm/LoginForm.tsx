import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input } from "../common";
import styles from "./LoginForm.module.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setLoginError("Заполните все поля");
      return;
    }
    setLoginError("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}>
            <span className={styles.authIcon}>СП</span>
            <h2 className={styles.authTitle}>Вход в аккаунт</h2>
            <p className={styles.authSubtitle}>
              Войдите в личный кабинет, чтобы добавлять истории, фотографии и
              сообщать о проблемах
            </p>
          </div>
          <div className={styles.authForm}>
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
            <Button variant="primary" fullWidth onClick={handleLogin}>
              Войти
            </Button>
            <div className={styles.authDivider}>или</div>

            <p className={styles.authNote}>
              Ещё нет аккаунта?{" "}
              <b>
                <Link className={styles.authNoteLink} to="/register">
                  Зарегистрируйтесь
                </Link>
              </b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
