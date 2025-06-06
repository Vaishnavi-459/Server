import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../baseUrl';


const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const hospitalId = localStorage.getItem('HospitalId');
    if (hospitalId) {
      fetchHospitalDetails(hospitalId);
    }
  }, []);


  const fetchHospitalDetails = async (id) => {
    console.log(id)

    setLoading(true)
    try {
      const url = `${BASE_URL}/doctors/hospitalById/${id}`;
      console.log(url)
      const response = await axios.get(url);
      console.log(response.data)
      console.log(response.status)
      if (response.status == 200) {


        setLoading(false)
        // const hospital = response.data.find(h => h.hospitalId == id);
        console.log(response.data)
        setSelectedHospital(response.data);
      }
      else {
        setLoading(false)
        console.log(response.message)
        setErrorMessage(response.message)
      }
    } catch (err) {
      console.error('Failed to fetch hospital:', err);
      setLoading(false)
    }
  };

  return (
    <HospitalContext.Provider value={{ selectedHospital, setSelectedHospital, loading, errorMessage, fetchHospitalDetails, }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => useContext(HospitalContext);
