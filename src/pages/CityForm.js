import React, { useState } from 'react';
import './CityForm.css';

const CityForm = ({ getData }) => {
  const [city, setCity] = useState(''); // Змінна з іменем введеного міста
  
  // Функція, яка при зміні значення текстового поля присвоює нове значення змінній city
  const handlerCity = e => setCity(e.target.value);

  /*
    Функція return() повертає форму з текстовим полем (в нього вводимо місто) 
    і кнопкою (при натисканні на неї здійснюється запит і перехід на сторінку WeatherData)
  */
  return (
    <div className="form-page">
        <form>
            <input 
              type="text" 
              value={city} 
              onChange={handlerCity} 
              placeholder="Type your city here"
            />
            <button onClick={(e) => {
              e.preventDefault();
              getData(city);
            }}>Get info</button>
        </form>
    </div>
  );
}

export default CityForm;
