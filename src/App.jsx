import React, { useEffect, useState } from "react";
import LinesChart from './LinesChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import WindLineChart from './VientChart';
import Humedad from './HumeChart';
import './style.css';


const App = () => {
  const api_key = '93b26e55808bcad76e8a5f896f3679c0';
  const [ciudad, setCiudad] = useState('Puebla');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windInfo, setWindInfo] = useState({ speed: 0, deg: 0 });

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
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (weatherData.main) {
        setTemp(weatherData.main.temp);
        setHumidity(weatherData.main.humidity);
        setWindInfo({
          speed: weatherData.wind.speed,
          deg: weatherData.wind.deg,
        });
      } else {
        console.log('No se encontraron datos de clima.');
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

  return(
    <>
      <div className='col-xs-12 col-md-8 col-lg-12'>
        <div className="card card-primary card-outline custom-bg">
          <div className="card-header custom-bg">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
              </div>
              <input className="form-control" placeholder={ciudad}></input>
            </div>
          </div>
          <div className="card-body custom-bg">
            <h2 className="custom-text">Clima</h2>
            <div className="row">
              <div className="col-md-8 col-lg-3 custom-card">
                <h5 className="custom-text">Ciudad: {ciudad}</h5>
                <h5 className='custom-text'>Ahora</h5>
                <h5 className='custom-text'>
                  <FontAwesomeIcon icon={faSun} className="custom-icon" /> {temp}
                </h5>
                <h5 className="custom-text">Mayormente Nublado </h5>
                <h5 className="custom-text">Humedad: {humidity}</h5>
                <h5 className="custom-text">Viento: {windInfo.speed} m/s, {windInfo.deg}°</h5>
              </div>

              <div className="col-md-8 col-lg-9">
                <div className="tab-content custom-bg" id="vert-tabs-tabContent">
                  {/* ... (Temperatura) */}
                  <div className="tab-pane text-left fade show active" role="tabpanel">
                    <div className="card card-primary custom-card">
                      <div className="card-header custom-bg">
                        <h3 className="card-title custom-text">Temperatura</h3>
                        <div className="card-tools">
                          <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="chart">
                          <LinesChart />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ... (Viento) */}
                  <div className="tab-pane text-left fade show active" role="tabpanel">
                  <div className="card card-primary custom-card">
                    <div className="card-header custom-bg">
                      <h3 className="card-title custom-text">Viento</h3>
                      <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                          <i className="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className='chart'>
                        <WindLineChart/>
                      </div>
                    </div>
                  </div>
                  </div>
                  {/* ... (Humedad) */}
                  <div className="tab-pane text-left fade show active" role="tabpanel">
                  <div className="card card-primary custom-card">
                    <div className="card-header custom-bg">
                      <h3 className="card-title custom-text">Humedad</h3>
                      <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                          <i className="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className='chart'>
                        <Humedad/>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;

