import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from './redux/searchSlice';

const App = () => {
  const search1 = useSelector((state) => state.search.query)
  const dispatch = useDispatch()
  const [myData, setMyData] = useState(null)
  const [error, setError] = useState('')
  const API_key = '2f01cdf66a6878e927ff2b053ec417e7'
  const API = `https://api.openweathermap.org/data/2.5/weather?q=${search1}&appid=${API_key}&units=metric`
  const fetchWeather = async () => {
    if (!search1.trim()) {
      setError('please enter a city name')
    }
    try {
      setError(null)
      const res = await axios.get(API)
      setMyData(res.data)

    } catch (error) {
      setMyData(null)
      if (error.response.status === 404) {
        setError("City not found. Please check the spelling.");
      }
      else {
        setError("Something went wrong. Please try again.");
      }
    }
  }
  useEffect(() => { fetchWeather() }, [])

  const onChangeHandler = (e) => {
    dispatch(setSearchQuery(e.target.value))
  }
  const onClickHandler = async () => {
    await fetchWeather()
    dispatch(setSearchQuery(''))
  }
  return (
    <div className='bg-blue-200 min-h-screen '>
      <div className=" flex flex-col items-center pt-[25vh] ">
        <div className=" container flex items-center justify-center w-full max-w-md gap-2">
          <input
            type="text"
            onChange={onChangeHandler}
            value={search1}
            className="w-[80%] p-2 rounded-lg border border-amber-400 text-sm sm:text-base"
            placeholder="Enter city name..."
          />
          <button
            onClick={onClickHandler}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FaSearch />
          </button>
        </div>
        {error && (
          <div className="mt-4 text-red-600 font-medium text-sm sm:text-base">
            {error}
          </div>
        )}

        {myData && (
          <div className="mt-6 p-5 w-[90%] sm:w-[70%] md:w-[50%] lg:[40%] bg-white rounded-2xl shadow-xl flex flex-col items-center gap-3 text-center">
            <img
              src={`https://openweathermap.org/img/wn/${myData.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="w-20 h-20"
            />
            <h2 className="text-xl sm:text-2xl font-semibold">{myData.name}</h2>
            <p className="text-lg sm:text-xl">{Math.trunc(myData.main.temp)}°C</p>
            <p className="text-sm sm:text-base text-gray-600 capitalize">
              Condition: {myData.weather[0].description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
