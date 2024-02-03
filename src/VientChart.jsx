import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WindLineChart = () => {
  const api_key = '93b26e55808bcad76e8a5f896f3679c0';
  const [ciudad, setCiudad] = useState('Puebla');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [windData, setWindData] = useState([]);

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
        console.log('No se encontraron datos de geocodificación.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWeatherData = async () => {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (weatherData.list) {
        setWindData(weatherData.list.map(item => item.wind.speed));
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
    getWeatherData();
  }, [lat, lon]);

  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Domingo ➡️", "Lunes ➡️", "Martes ➡️", "Miércoles ➡️", "Jueves ➡️", "Viernes ➡️", "Sábado ➡️"],
        datasets: [
          {
            label: 'Velocidad del Viento (m/s)',
            data: windData,
            tension: 0.5,
            fill: false,
            borderColor: 'rgb(70, 130, 180)',
            pointRadius: 5,
            pointBorderColor: 'rgb(70, 130, 180)',
            pointBackgroundColor: 'rgb(70, 130, 180)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Velocidad del Viento (m/s)',
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [windData]);

  return (
    <canvas
      id="windLineChart"
      style={{ minHeight: '250px', height: '250px', maxHeight: '250px', maxWidth: '100%', display: 'block', width: '572px', width: '715', height: '312'}}
      className="chartjs-render-monitor"
      ref={chartRef}
    ></canvas>
  );
};

export default WindLineChart;
