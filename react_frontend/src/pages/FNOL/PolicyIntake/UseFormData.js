// useForm.js
import { useState, useEffect } from "react";

const useFormData = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    const storedData = localStorage.getItem('PolicyIntakeData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      localStorage.setItem('PolicyIntakeData', JSON.stringify(updatedData)); // Save to localStorage
      return updatedData;
    });
  };

  return [formData, handleChange];
};

export default useFormData;
