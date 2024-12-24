import React, { useState, useEffect } from "react";
import styles from "./Form.module.css"
import DiscountImage from '../../assets/Discount.webp';
import Correct from '../../assets/Checkmark.svg'



const ContactForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState([]);
  const [message, setMessage] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Проверяем localStorage при монтировании компонента
    const storedSuccessMessage = localStorage.getItem("formSubmitted");
    if (storedSuccessMessage === "true") {
      setShowSuccessMessage(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Замените 'YOUR_BOT_TOKEN' на токен вашего бота
      const response = await fetch(
        `https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: import.meta.env.VITE_CHAT_ID, // Замените на ID чата админа
            text: `Новая заявка:\nИмя: ${name}\nТелефон: ${phone}\nНаселенный пункт: ${city}\nОрганизация: ${organization}\nСообщение: ${message}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка отправки сообщения в Telegram");
      }

      setIsLoading(false);
      setShowSuccessMessage(true); // Отображаем сообщение об успехе
      localStorage.setItem("formSubmitted", "true");
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };


  return (
    <div className={styles.formWrapper}>
      {showSuccessMessage ? (
        <div className={styles.correct}>
          <img src={Correct} alt="Иконка подтверждения" width="32" height="32" />
          <p className={styles.success}>
            Спасибо! Данные отправлены! Мы свяжемся с вами в ближайшее время!
          </p>
        </div>
      ) : (
        <>
        <form onSubmit={handleSubmit}>
          <h2>Форма обратной связи</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <div>
            <input
              type="text"
              placeholder="Напишите своё имя"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="+7 (999) 999-99-99"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Москва"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="text"
              placeholder="Организация"
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            />
          </div>
          <div>
          <textarea
            placeholder="Сообщение"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className={styles.messageInput}
          />
          </div>
          <div className={styles.checkboxWrapper}>
            <label htmlFor="agreement" className={styles.CheckLabel}>Согласие на обработку персональных данных</label>
            <input type="checkbox" id="agreement" value={agreement} onChange={(e) => setAgreement(true)} required/>
            
          </div>
          <button type="submit" disabled={isLoading} className={styles.send}>
            {isLoading ? "Отправка..." : "Отправить"}
          </button>
        </form>
        </>
      )}
    </div>
  );
};

export default ContactForm;