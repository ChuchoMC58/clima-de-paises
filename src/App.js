import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')
	
  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
	  async function getCountrys(){
			if(!name){
				return 
			}			
		  axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
				.then((res) => {
					const countrys = res.data.filter(c => c.name.common.toLowerCase().includes(name))
					setCountry(countrys)
				})
			/* try{
				const res = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
				res.found = true
				console.log(res)
				setCountry(res)
			}catch(e){ 
				setCountry({found: false})
			}		 */
		}
		getCountrys()
	}, [name])

  return country
}

const Country = ({ country }) => {
	const [weather, setWeather] = useState(null)
	/* const lat = 17.987720
	const lon = -94.558280 */
	const api_key = "3d294388f2d839c10c5931149389d020" 
	// 

	useEffect(() => {
		async function getWeather(){
			const finalRes = []
			console.log(country.length) 
			for(let i=0;i<country.length;i++){
				const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${country[i].cca2}&appid=${api_key}`)
				console.log(country[i].cca2) 
				const lat = res.data[0].lat
			 	const lon = res.data[0].lon
				const res2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
				console.log(res2)
				finalRes.push(res2.data)
			}
			 setWeather(finalRes)
		}
		getWeather()
	}, [country])

	if (!country || !weather || country.length>weather.length) {
    return null
  }
	const length = country.length
	
	if (length > 10) {
    return (
      <div>
        too many, be more specific
      </div>
    )
  }

  return (
		<>
			{country.map((c, index) => 
				<Show country={c} clima={weather[index]}/> 		
			)}
		</>
  )
}

function Show({country, clima}){
	const [show, setShow] = useState(false)
	const icon = `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`
	return(
		<div>
			{!show && 
			<div>
				<h3>{country.name.common} </h3>
				<button onClick={() => setShow(true)}>show</button>
			</div>
			}
			{show && 
				<>
					<div>
							<h2>{country.name.common} </h2>
							<div>Capital: {country.capital} </div>
							<div>Population: {country.population}</div> 
							<div>Bandera: {country.flag}</div> 
							<h3>Clima:</h3> 
							<div>{clima.weather[0].main}</div>
							<img src={icon} />
					</div> 
					<div>
						<button onClick={() => setShow(false)}>hide</button>
					</div>
				</>
			}
		</div>		
	)
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)
	
  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
		<div>
			<span>Escribe el Pais del que quieras saber el Clima.</span>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

			{!country && <></>}
			{country && <Country country={country} />}
      
    </div>
  )
}

export default App