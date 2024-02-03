import React, { useState, useEffect, useRef } from 'react';
import 'chart.js/auto';
import { Chart } from 'chart.js';

const HumidityChart = () => {
  const api_key = '93b26e55808bcad76e8a5f896f3679c0';
  const [ciudad, setCiudad] = useState('Puebla');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const getGeocodingData = async (ciudad, pais, limite) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=${limite}&appid=${api_key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        setCiudad(data[0].name);
        setLat(data[0].lat);
        setLon(data[0].lon);
      } else {
        console.log('Error de Conexion a internet.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWeatherForecast = async () => {
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    try {
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (forecastData.list) {
        setForecastData(forecastData.list);
        setSelectedDay(forecastData.list[0].dt); // Establecer el primer día como seleccionado inicialmente
      } else {
        console.log('No se encontraron datos de pronóstico.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGeocodingData(ciudad, 'MX', 3);
  }, [ciudad]);

  useEffect(() => {
    getWeatherForecast();
  }, [lat, lon]);

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: forecastData.map((item) => {
          const date = new Date(item.dt * 1000);
          return date.toLocaleDateString('es-MX', { weekday: 'long' });
        }),
        datasets: [
          {
            label: 'Humedad',
            data: forecastData.map((item) => item.main.humidity),
            tension: 0.5,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            pointRadius: 5,
            pointBorderColor: 'rgba(75, 192, 192)',
            pointBackgroundColor: 'rgba(75, 192, 192)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            max: 100, // Configuración opcional para el eje y si quieres que vaya de 0 a 100 (porcentaje de humedad)
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            setSelectedDay(forecastData[elements[0].index].dt);
          }
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [forecastData]);

  return (
    <div>
      <canvas
        id="humidityChart"
        style={{ minHeight: '250px', height: '250px', maxHeight: '250px', maxWidth: '100%', display: 'block', width: '572px', width: '715', height: '312' }}
        className="chartjs-render-monitor"
        ref={chartRef}
      ></canvas>
      {selectedDay && (
        <p>
          Humedad para el {new Date(selectedDay * 1000).toLocaleDateString('es-MX', { weekday: 'long' })}: {forecastData.find((item) => item.dt === selectedDay).main.humidity}%
        </p>
      )}
    </div>
  );
};

export default HumidityChart;
