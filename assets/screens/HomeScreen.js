import { StyleSheet, Text, View ,Image,ScrollView,TextInput,Alert,TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';




const HomeScreen = () => {

 const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);

  const API_KEY = '6480c7184886d3ef841ebda89aee1e4d';

  const fetchWeatherByCity = (cityName) => {
  fetchCoordinatesByCity(cityName);
};


  const fetchCoordinatesByCity = async (cityName) => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: cityName,
        limit: 1,
        appid: API_KEY,
      },
    });

    if (res.data.length > 0) {
      const { lat, lon, name } = res.data[0];
      fetchWeatherByCoordinates(lat, lon, name);
    } else {
      console.warn('Location not found');
      Alert.alert("Error", "Location not found. Try a nearby area.");
    }
  } catch (err) {
    console.error('Geocoding error:', err);
  }
};

const fetchWeatherByCoordinates = async (lat, lon, locationName) => {
  try {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY,
      },
    });

    setWeatherData({ ...res.data, name: locationName });
    console.log('Searched City:', locationName);

    fetchForecast(lat, lon);
  } catch (err) {
    console.error('Weather fetch error:', err);
  }
};



 const fetchForecast = async (lat, lon) => {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY,
      },
    });

    const hourly = res.data.list;
    const daily = getDailyForecast(hourly);

    setForecastData({ hourly, daily });
  } catch (err) {
    console.error('Forecast fetch failed:', err);
  }
};



  const getDailyForecast = (list) => {
  const daily = {};

  list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0]; 
    if (!daily[date]) {
      daily[date] = [];
    }
    daily[date].push(item);
  });

  const result = Object.keys(daily).map(date => {
    const entries = daily[date];

  
    const temps = entries.map(e => e.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);

    
    const midEntry = entries[Math.floor(entries.length / 2)];

    return {
      date,
      temp: {
        min,
        max,
      },
      weather: midEntry.weather[0],
      dt: midEntry.dt,
    };
  });

  return result;
};


  useEffect(() => {
    fetchWeatherByCity('Hyderabad');
    console.log(weatherData?.name);
  }, []);

  






  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#FFFFFF',paddingBottom:-15}}>

      <Text style={{ fontSize: 18, fontWeight: '500', color: '#111827', marginBottom: 8, marginLeft:20,marginTop:5}}>
  Current Weather
</Text>
<View style={{paddingBottom:5}}>

      <View style={{flexDirection: 'row',
      width: '95%',
      height: 46,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      paddingHorizontal: 10,
      alignSelf: 'center',
      marginTop: 5,
      alignItems: 'center',
      justifyContent: 'space-between'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
      <TextInput
        style={{
          fontSize: 16,
          color: '#111827',
          flex: 1,
          outlineWidth: 0,
        }}
        placeholder="Search for a city..."
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => fetchWeatherByCity(city)}
      />
    </View>

            <TouchableOpacity onPress={() => fetchWeatherByCity(city)}>
      <Text style={{ fontSize: 16, color: '#3B82F6', fontWeight: '500', paddingHorizontal: 5 }}>
        Search
      </Text>
    </TouchableOpacity>
        </View>
        </View>

       <ScrollView style={{flex:1}}>
        <View style={{flex:1,alignItems:'center',backgroundColor:'#FFFFFF',paddingHorizontal:15}}>
         

    
        
        
        <LinearGradient
  colors={['#EEF6FF', '#FFFFFF']} 
  style={{width:'100%',borderRadius:12,marginTop:10}}
  
>

        <View style={{width:'100%',height:216,paddingHorizontal:25,paddingTop:23}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View>
                    <Text style={{fontSize:25,fontWeight:'500',color:'#111827'}}>{weatherData?.name}</Text>
                    <Text style={{fontSize:16,fontWeight:'400',color:'#4B5563',marginTop:3}}>{weatherData?.weather[0]?.description}</Text>
                </View>
                <View>
                    <Image source={require('../images/sky.jpg')} style={{height:48,width:48}} />

                </View>
            </View>

            <View style={{flexDirection:'row',height:68,width:310,alignItems:'center',marginTop:10,paddingHorizontal:8}}>
                <Text style={{fontSize:48,fontWeight:'500',color:'#111827'}}>{Math.round(weatherData?.main?.temp)}°</Text>
                <Text style={{fontSize:16,fontWeight:'400',color:'#4B5563',marginLeft:20}}>{Math.round(weatherData?.main?.feels_like)}° feels like</Text>
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>

          

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Feather name="droplet" size={16} color="#3B82F6" />
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>
    {weatherData?.main?.humidity}%
  </Text>
</View>

<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 20 }}>
  <Feather name="wind" size={16} color="#3B82F6" />
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>
    {weatherData?.wind?.speed} mph
  </Text>
</View>

  </View>

           

        </View>

        </LinearGradient>

        <View style={{width:'100%',height:204,borderRadius:12,marginTop:10,paddingHorizontal:5}}>
            <View style={{width: '100%', alignItems: 'flex-start', paddingHorizontal: 5, marginTop: 10,flexDirection:'row',gap:10,alignItems:'center'}}>
              <View>
                <Feather name="clock" size={18} color="#3B82F6" />
              </View>

              <Text style={{fontSize:18, fontWeight:'500', color:'#111827'}}>
               Hourly Forecast
            </Text>
        </View>

        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
         { forecastData?.hourly?.slice(0, 5).map((item, index) => (
  <View key={index} style={{ width: 60, height: 144, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
    <Text style={{ fontSize: 16, fontWeight: '400', color: '#4B5563' }}>
      {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}

    </Text>
    <Image
      source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
      style={{ width: 32, height: 32 ,tintColor: '#3B82F6'}}
    />
    <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
      {Math.round(item.main.temp)}°
    </Text>
  </View>
))}

 </View> 

       

        </View>

      <View style={{ width: '100%', marginTop: 5, paddingHorizontal: 5, alignItems: 'center' }}>
  <View style={{ width: '100%', alignItems: 'flex-start', paddingHorizontal: 5 ,flexDirection:'row',gap:10,alignItems:'center'}}>
    <View>
      <Feather name="calendar" size={18} color="#3B82F6" />
    </View>
    <Text style={{ fontSize: 18, fontWeight: '500', color: '#111827' }}>Upcoming 7-Day Forecast</Text>
  </View>

  {forecastData?.daily?.slice(0, 7).map((day, index) => (
    <View
      key={index}
      style={{
        width: '100%',
        height: 57,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center', 
        marginTop: 8,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>

      <Image
        source={{ uri: day.weather?.icon ? `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png` : '' }}
        style={{ height: 32, width: 32 }}
      />

      <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
        {Math.round(day.temp.max)}°
        <Text style={{ fontWeight: '400', color: '#4B5563' }}> {Math.round(day.temp.min)}°</Text>
      </Text>
    </View>
  ))}
</View>

<View style={{width:'100%',flexDirection:'row',flexWrap: 'wrap', justifyContent: 'space-between',marginTop:20,gap:20}}>
  <View style={{height:88,width:177,backgroundColor:'#F9FAFB',borderRadius:12,alignItems:'center',justifyContent:'space-evenly',alignSelf:'flex-start'}}>
     <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',gap:10}}>
            <View>
                <Feather name="droplet" size={18} color="#3B82F6" />

            </View>
           <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>Humidity</Text>

  </View>
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
    {weatherData?.main?.humidity}%
  </Text>
</View>


<View style={{height:88,width:177,backgroundColor:'#F9FAFB',borderRadius:12,alignItems:'center',justifyContent:'space-evenly',alignSelf:'flex-start'}}>
     <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',gap:10}}>
            <View>
                <Feather name="wind" size={18} color="#3B82F6" />

            </View>
           <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>Wind Speed</Text>

  </View>
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
    {weatherData?.wind?.speed}%
  </Text>
</View>


<View style={{height:88,width:177,backgroundColor:'#F9FAFB',borderRadius:12,alignItems:'center',justifyContent:'space-evenly',alignSelf:'flex-start'}}>
     <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',gap:10}}>
            <View>
                <MaterialCommunityIcons name="weather-sunset-up" size={18} color="#3B82F6" />

            </View>
           <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>sunrise</Text>

  </View>
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
    {new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString()}

  </Text>
</View>

<View style={{height:88,width:177,backgroundColor:'#F9FAFB',borderRadius:12,alignItems:'center',justifyContent:'space-evenly',alignSelf:'flex-start'}}>
     <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',gap:10}}>
            <View>
                <MaterialCommunityIcons name="weather-sunset-down" size={18} color="#3B82F6" />

            </View>
           <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>sunset</Text>

  </View>
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
    {new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString()}

  </Text>
</View>

<View style={{height:88,width:177,backgroundColor:'#F9FAFB',borderRadius:12,alignItems:'center',justifyContent:'space-evenly',alignSelf:'flex-start'}}>
     <View style={{justifyContent:'flex-start',alignItems:'center',flexDirection:'row',gap:10}}>
            <View>
                <Feather name="eye" size={18} color="#3B82F6" />

            </View>
           <Text style={{ fontSize: 16, fontWeight: '500', color: '#4B5563' }}>Visibility</Text>

  </View>
  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>
   {(weatherData?.visibility / 1000).toFixed(1)} km

  </Text>
</View>


       


         </View>
         </View>
          </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({

 
})