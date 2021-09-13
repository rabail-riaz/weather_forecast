import React from 'react';
// import './App.css';
import { Button, InputGroup, FormControl, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { ForecastState } from "../redux/reducers/forecastReducer";
import list from '../services/services'

function App() {
    const [unit, setUnit] = React.useState<string>("metric");
    const [query, setQuery] = React.useState<string>("q");
    const [queryValue, setQueryValue] = React.useState<string>("");
    const [wholeDayWeather, setWholeDayWeather] = React.useState<{ [key: string]: any }>({});
    const city = useSelector<ForecastState, ForecastState["city"]>((state) => state?.city);
    const forecast = useSelector<ForecastState, ForecastState["forecast"]>((state) => state?.forecast);
    const dispatch = useDispatch();

    const getWeatherDetail = () => {
        list({ [query]: queryValue, units: unit }).then((response) => {
            dispatch({ type: 'SET_WEATHER_DETAIL', payload: { forecast: response?.data?.list, city: response?.data?.city } })
        });
    }
    React.useEffect(() => {
        if (queryValue)
            getWeatherDetail();
    }, [unit]);
    React.useEffect(() => {
        let dayWeather: { [key: string]: any } = {};
        forecast?.forEach((weather) => {
            let temp_min = dayWeather[getDayName(weather?.dt_txt, true)]?.main?.temp_min;
            dayWeather[getDayName(weather?.dt_txt, true)] = weather
        })
        setWholeDayWeather(dayWeather)
    }, [forecast])

    const getDayName = (dateString: string, isDayNumber: boolean) => {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date(dateString);
        return isDayNumber ? d.getDay() : days[d.getDay()];

    }
    const getWeatherIcon = (iconName: string) => {
        switch (iconName) {
            case "Clear":
                return <i className="bi bi-sun"></i>
            case "Rain":
                return <i className="bi bi-cloud-rain"></i>
            case "Clouds":
                return <i className="bi bi-cloud"></i>
            default:
                return <i className="bi bi-sun"></i>
        }
    }
    return (
        <>
            <Row>
                <Col sm={12} md={10} className="m-auto text-white p-3" style={{ background: "#3b3b61" }}>WEATHER FORECAST (5 DAYS)</Col>
            </Row>
            <Row>
                <Col sm={12} md={6} className="m-auto mt-4">
                    <InputGroup className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            title={query === "q" && "City Name" || query === "id" && "City ID" || query === "zip" && "Zip Code" || "Search by"}
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item
                                onClick={() => {
                                    setQueryValue("");
                                    setQuery("q")
                                }}
                            >City Name</Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setQueryValue("");
                                    setQuery("id")
                                }}
                            >City ID</Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setQueryValue("");
                                    setQuery("zip")
                                }}
                            >Zip Code</Dropdown.Item>
                        </DropdownButton>
                        <FormControl
                            aria-label="Text input with dropdown button"
                            value={queryValue}
                            onKeyUp={(e) => {
                                if (e.code === "Enter" && queryValue.length >= 3) {
                                    getWeatherDetail();
                                }
                            }}
                            onChange={(e) => {
                                setQueryValue(e.target.value)
                            }}
                        />
                        <Button
                            className="d-grid col-2 mx-auto"
                            variant="outline-secondary w-80"
                            onClick={() => {
                                if (queryValue.length >= 3) {
                                    getWeatherDetail();
                                }
                            }}
                        >
                            <i className="bi bi-search"></i>
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            {city?.name && <>
                <Row>
                    <Col sm={12} md={6} className="m-auto">
                        <div className="text-secondary m-3">
                            <label className="d-block h3">{`${city?.name}, ${city.country}`}</label>
                            <label className="d-block">{getDayName(forecast[0]?.dt_txt, false)}</label>
                            <label className="d-block">{forecast[0]?.weather[0]?.main}</label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6} className="m-auto">
                        <Row>
                            <Col sm={12} md={7} className="m-4">
                                <div style={{ marginLeft: '2vw' }}>
                                    <label className="h1">
                                        {getWeatherIcon(forecast[0]?.weather[0]?.main)}
                                    </label>
                                    <label className="h1">{`${forecast[0]?.main?.temp}`}</label>
                                    <label className={`h1 text-secondary align-top btn ${unit === "metric" && "text-decoration-underline"}`} onClick={() => { setUnit("metric") }}>°C</label>
                                    <label className="h3 text-secondary align-top">|</label>
                                    <label className={`h1 text-secondary align-top btn ${unit === "imperial" && "text-decoration-underline"}`} onClick={() => { setUnit("imperial") }}>°F</label>
                                </div>
                            </Col>
                            <Col sm={12} md={4}>
                                <div style={{ marginLeft: '2vw' }} className="text-secondary">
                                    <label className="d-block">Pressure: {`${forecast[0]?.main?.pressure} hPa`} </label>
                                    <label className="d-block">Humidity: {`${forecast[0]?.main?.humidity} %`}</label>
                                    <label className="d-block">Windspeed: {`${forecast[0]?.wind?.speed} m/s`}</label>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6} className="m-auto">
                        <Row className="d-flex justify-content-center text-secondary">
                            {
                                Object.keys(wholeDayWeather)?.map((key: string, index: number) => {
                                    return index > 0 && <Col sm={2} key={wholeDayWeather[key]?.dt} className="text-center">
                                        <label className="d-block">{getDayName(wholeDayWeather[key]?.dt_txt, false)} </label>
                                        <label className="d-block h2">
                                            {getWeatherIcon(wholeDayWeather[key]?.weather[0]?.main)}
                                        </label>
                                        <label className="d-block">{`${Math.round(parseInt(wholeDayWeather[key]?.main?.temp_min))}° ${Math.round(parseInt(wholeDayWeather[key]?.main?.temp_max))}°`}</label>
                                    </Col>
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </>}
        </>
    );
}

export default App;
