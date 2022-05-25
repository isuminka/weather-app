import React, { useState } from 'react';
import CityForm from './pages/CityForm';
import WeatherData from './pages/WeatherData';
import { useAlert } from "react-alert";
import './App.css';

const App = () => {
  const [data, setData] = useState({ }); // Об'єкт з інформацією про погоду
  const [isCitySelected, setIsCitySelected] = useState(false); // Змінна, яка вказує, чи місто було обране

  const alert = useAlert();
  
  // Функція, яка використовуючи api сайту openweathermap.org отримує інформацію про погоду (json-об'єкт)
  const getData = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4dea29c935cb5079d358c90a7dba576f`;

    // Якщо ввели місто
    if(city) {
      const response = await fetch(url); // Робимо запит
      const weatherData = await response.json(); // Перетворюємо json-відповідь у звичайний об'єкт

      // Якщо було введено неіснуюче місто
      if(!weatherData.name) {
        alert.error("Введіть коректне місто!"); // Виводимо повідомлення про те, щоб користувач ввів коректне місто
      }
      // Якщо все правильно
      else {
        setData({ ...weatherData }); 
        setIsCitySelected(true); // Вказуємо, що місто було введено
      }
    }
    // Якщо не ввели місто
    else {
      alert.error("Введіть місто!"); // Виводимо повідомлення про те, щоб користувач ввів місто
    }
  }

  // Функція для повернення на сторінку CityForm при натисканні на кнопку
  const goBack = () => setIsCitySelected(false);

  /*
    Функція return() повертає одну з двох сторінок - WeatherData (якщо обрали місто) або CityForm (якщо місто не обране)
    На сторінці WeatherData відображається інформація про погоду
    На сторінці CityForm розташована форма у якій вводимо місто, погоду в якому ми бажаємо переглянути 
  */

  return (
    <>
      {isCitySelected ? <WeatherData data={data} getData={getData} goBack={goBack} /> : <CityForm getData={getData} />}
    </>
  );
}

export default App;
