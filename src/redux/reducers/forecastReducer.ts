export interface ForecastState {
    city: {
        name: string,
        country: string
    },
    forecast: Object[]
}

const initialState = {
    city: {
        name: '',
        country: ''
    },
    forecast: []
}
// type Array = 
type Action = { type: string, payload: object }
type weatherObject = { main: string }
export type Object = {
    main: {
        temp: string,
        temp_min: string,
        temp_max: string,
        pressure: number,
        humidity: number
    },
    dt: number,
    dt_txt: string,
    weather:weatherObject[],
    id:number,
    wind:{
        speed:number
    }
}

export const forecastReducer = (state: ForecastState = initialState, action: Action) => {
    switch (action.type) {
        case "SET_WEATHER_DETAIL": {
            return { ...state, ...action.payload }
        }
        default:
            return state
    }
}