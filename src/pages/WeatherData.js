import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { FaTachometerAlt, FaArrowLeft, FaSync, FaTemperatureLow, FaTemperatureHigh } from "react-icons/fa";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { useAlert } from "react-alert";
import { BsDropletFill } from "react-icons/bs";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import './WeatherData.css';

// Масиви для зберігання прогнозу погоди та часу
let forecast = [], categories = [];

const WeatherData = ({ data, getData, goBack }) => {
  const [rotation, setRotation] = useState(0); // Значення кута повороту іконки
  const [daysForecast, setDaysForecast] = useState([]); // Прогноз погоди за один день
  const [selected, setSelected] = useState(0); // Змінна в якій зберігається індекс дня, прогноз погоди якого ми переглядаємо (від 0 до 4)
  const [dayTemp, setDayTemp] = useState({ min: '', max: '' }); // Об'єкт зі значеннями мінімальної та максимальної температури за день
  const alert = useAlert();

  // Об'єкт, в якому описуються усі стилі графіка прогнозу погоди, а також вказані дані, по яким буде відбуватися побудова графіка
  const [options, setOptions] = useState({
    chartOptions: {
      chart: {
        height: 220,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        style: {
          fontFamily: 'serif'
        }
      },
      title: {
          text: 'Forecast',
          align: 'center',
          margin: 30,
          style: {
            color: "rgb(230, 230, 230)"
          }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      xAxis: [{
        categories: categories,
        labels: {
          style: {
            color: "rgb(223, 223, 223)"
          }
        }
      }],
      yAxis: [{
        title: {
          enabled: false
        },
        labels: {
          style: {
            color: "rgb(223, 223, 223)"
          }
        }
      }],
      series: [{ data: forecast }],
      plotOptions: {
        line: {
          color: 'rgb(233, 0, 0)',
        }
      }
    },
    color: 'white'
  });

  // Функція, яка додає нулі перед значеннями дати
  const addZero = num => (num <= 9) ? ("0" + num) : num;

  // Функція, яка використовуючи api сайту openweathermap.org отримує прогноз погоди на 5 днів
  const getWeatherForecast = async (day = 0) => {
    const API_key = '4dea29c935cb5079d358c90a7dba576f'; // api-ключ
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${API_key}`; // url

    const response = await fetch(url); // Здійснюємо запит
    const weatherForecast = await response.json(); // Перетворюємо json-відповідь у звичайний об'єкт
    // Домножуємо кожне значення часу у отриманому об'єкті на 1000
    const list = weatherForecast.list.map(item => {
      return {
        ...item,
        dt: item.dt * 1000
      }
    });

    forecast = [];
    categories = [];

    // Заповнюємо масив categories значеннями часу (для побудови графіка)
    list.forEach((item, i) => {
      let date = new Date(item.dt), label = addZero(date.getDate()) + "." + addZero(date.getMonth() + 1);
      categories.push(label);
    });  

    // Масив, в якому зберігаються дати прогнозу погоди (день та місяць, усього 5 дат)
    let uniqueDays = categories.filter((item, i, ar) => ar.indexOf(item) === i);
    let days = [];
    // Присвоюємо кожному дню унікальний id, додавши у масив days об'єкт з датою прогнозу погоди і id
    for(let i = 0; i < uniqueDays.length; i++) {
      days.push({
        name: uniqueDays[i],
        id: i
      });
    }
    setDaysForecast([...days]); // Присвоюємо змінній daysForecast масив days
    
    // 
    let firstDay = uniqueDays[day];
    let dayForecast = list.filter(item => {
      let date = new Date(item.dt)
      return (addZero(date.getDate()) + "." + addZero(date.getMonth() + 1)) === firstDay;
    });

    let hours = [];
    dayForecast.forEach(item => {
      let date = new Date(item.dt), label = addZero(date.getHours()) + ":" + addZero(date.getMinutes());
      hours.push(label);
      forecast.push(Number((item.main.temp - 273.15).toFixed(2)));
    });
    
    // Встановлюємо значення мінімальної та максимальної температури за день
    setDayTemp({ min: Math.min(...forecast), max: Math.max(...forecast) });

    // Встановлюємо параметри, по яким будується графік
    setOptions({ 
      chartOptions: { 
        series: [{ data: forecast }],
        xAxis: [{ categories: hours }]
      }
    });
  }

  // При завантаженні сторінки викликається функція getWeatherForecast
  useEffect(() => getWeatherForecast(), []);

  // Функція, яка відстежує id обраного дня прогнозу погоди (для зміни кольору)
  const changeColor = id => setSelected(id);

  return (
    <div className="weather-page">
        <div className="nav">
            <button onClick={goBack}>
              <FaArrowLeft size={26} color="white" />
            </button>

            <div>
              <p>{data.name}, {data.sys.country}</p>
            </div>

            <button onClick={() => {
              // При натисканні на кнопку для оновлення інформації про погоду відбуватиметься анімація 
              let newRotation = rotation + 360;
              setRotation(newRotation);
              getData(data.name); // Присвоюємо нові дані
              alert.success("Інформація оновлена"); // Виводимо повідомлення про те, що інформація оновлена
            }}>
              <FaSync 
                size={26} 
                color="white" 
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: '1s ease'
                }}
              />
            </button>
        </div>
        
        <div className="data">
          <div className="row">
            <div className="data-block">
              <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} width="80" height="80" alt="weather-img" />
              <p>{data.weather[0].main}</p>
            </div>

            <div className="data-block">
              <div className="temp">
                <p>{(data.main.temp - 273.15).toFixed(2)}°С</p>
              </div>
              <div className="min-max-temp">
                <div>
                  <FaTemperatureLow size={24} />
                  <p>{(data.main.temp_min - 273.15).toFixed(2)}°С</p>
                </div>
                <div>
                  <FaTemperatureHigh size={24} />
                  <p>{(data.main.temp_max - 273.15).toFixed(2)}°С</p>
                </div>
              </div>
            </div>

            <div className="data-block">

              <div className="sunrise">
                <FiSunrise size={56} />
                <div>
                  <p>Sunrise</p>
                  <p>{addZero(new Date(data.sys.sunrise * 1000).getHours())}:{addZero(new Date(data.sys.sunrise * 1000).getMinutes())}</p>
                </div>
              </div>

              <div className="sunset">
                <FiSunset size={56} />
                <div>
                  <p>Sunset</p>
                  <p>{addZero(new Date(data.sys.sunset * 1000).getHours())}:{addZero(new Date(data.sys.sunset * 1000).getMinutes())}</p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="row">

            <div className="data-block">  
              <div className="pressure">
                <FaTachometerAlt size={56} />
                <div>
                  <p>Pressure</p>
                  <p>{(data.main.pressure / 1.333).toFixed(2)} Torr</p>
                </div>
              </div>

              <div className="humidity">
                <BsDropletFill size={50} />
                <div>
                  <p>Humidity</p>
                  <p>{data.main.humidity}%</p>
                </div>
              </div>
            </div>

            <div className="data-block">
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDsuTv3gpx2UQ--PT43bmoSECuMvYeRJ0A' }}
                defaultCenter={{ lat: data.coord.lat, lng: data.coord.lon }}
                defaultZoom={11}
              >  
              </GoogleMapReact>
            </div>

            <div className="data-block">
              <div className="min-max-day-temp">
                <p>min: {dayTemp.min}°С</p>
                <p>max: {dayTemp.max}°С</p>
              </div>
              <div style={{width: '100%'}}>
                <HighchartsReact highcharts={Highcharts} options={options.chartOptions} />
              </div>
              <ul className="days">
                {/* Виводимо список усіх днів, прогноз погоди яких ми можемо переглянути */}
                {daysForecast.map((item, i) => {
                  return <li key={i} style={{ backgroundColor: selected === i ? 'rgb(140, 140, 140)' : 'inherit' }} onClick={() => {
                    changeColor(i);
                    getWeatherForecast(i);
                  }}>{item.name}</li>
                })}
              </ul>
            </div>
            
          </div>
  
        </div>

    </div>
  );
}

export default WeatherData;
