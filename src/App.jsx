import React, { useEffect, useState } from "react";
import "@maxhub/max-ui/dist/styles.css";
import { MaxUI, Panel, Button } from "@maxhub/max-ui";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.WebApp) {
      // Сообщаем платформе, что приложение готово
      window.WebApp.ready();

      // Получаем стартовые данные
      const info = window.WebApp.initDataUnsafe || window.WebApp.initData || {};
      setUser(info.user || null);

      // Подписка на события (пример)
      window.WebApp.onEvent("backButtonPressed", () => {
        console.log("Пользователь нажал кнопку назад");
      });
    }
  }, []);

  const handleContact = () => {
    if (window.WebApp) {
      window.WebApp.requestContact();
    }
  };

  return (
    <MaxUI>
      <Panel centeredX centeredY>
        <h2>Привет{user ? `, ${user.first_name}` : ""}!</h2>
        <Button onClick={handleContact}>Отправить телефон</Button>
      </Panel>
    </MaxUI>
  );
}
