import { useState } from "react";
import { Link } from "react-router-dom";

import { API_URL, LS_ACCESS_TOKEN } from "../../constants";

import { Button, Input } from "../common";
import styles from "./LoginForm.module.css";

type FormStep = "login" | "verify";

function LoginForm() {
  const [step, setStep] = useState<FormStep>("login");

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email) {
      setError("Заполните все поля");
      return;
    }
    try {
      const url = `${API_URL}/users/login`;
      const body = JSON.stringify({ email });
      const response = await fetch(url, {
        method: "POST",
        body,
        headers: { "Content-type": "application/json" },
      });
      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem(LS_ACCESS_TOKEN, access_token);
        setStep("verify");
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.detail || "Ошибка при авторизации.");
      }
    } catch {
      setError("Ошибка сети.");
    }
  };

  const handleVerify = async () => {
    setError("");
    if (!verificationCode) {
      setError("Введите код");
      return;
    }
    try {
      const body = JSON.stringify({
        email: email,
        code: verificationCode,
      });
      console.log(body);
      const response = await fetch(`${API_URL}/users/verify`, {
        method: "POST",
        body,
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          localStorage.setItem(LS_ACCESS_TOKEN, data.access_token);
          console.log("Verified successfully");
          window.location.href = "/profile";
        } else {
          alert(data.message);
        }
      }
    } catch {
      setError("Ошибка при проверке кода.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}>
            <h2 className={styles.authTitle}>
              {step === "login" ? "Вход в аккаунт" : "Подтверждение"}
            </h2>
            <p className={styles.authSubtitle}>
              {step === "login"
                ? "Войдите в личный кабинет, чтобы добавлять истории и сообщать о проблемах"
                : "Введите код, который мы отправили на вашу почту"}
            </p>
          </div>

          <div className={styles.authForm}>
            {step === "login" && (
              <>
                <Input
                  type="email"
                  label="Электронная почта"
                  placeholder="volunteer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {error && <p className={styles.fieldError}>{error}</p>}
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
              </>
            )}

            {step === "verify" && (
              <>
                <Input
                  type="text"
                  label="Код подтверждения"
                  placeholder="Введите код"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                {error && <p className={styles.fieldError}>{error}</p>}
                <Button variant="primary" fullWidth onClick={handleVerify}>
                  Подтвердить
                </Button>
                <button
                  className={styles.backLink}
                  onClick={() => setStep("login")}
                  type="button"
                >
                  ← Вернуться ко входу
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
