import axios from "axios"

const env = import.meta.env

const API_URL = `${env.VITE_API_BASE_URL}/${env.VITE_REGISTRATION_ENDPOINT}`

/**
 * Get all registered users from the API.
 * @returns {Promise<Array>} array of user objects
 */
export const getAllUsers = async () => {
  console.log("[authApi] getAllUsers - URL:", API_URL)
  const response = await axios.get(API_URL)
  console.log("[authApi] Total registered users:", response.data.length)
  return response.data

}

/**
 * Post user data to the API.
 * @param {Object} userData - { name, email, mobile, password, image }
 * @returns {Promise} Axios response
 */
export const registerUser = async (userData) => {
  console.log("[authApi] registerUser - Posting new user...")
  const response = await axios.post(API_URL, userData)
  console.log("[authApi] registerUser - Response:", response.data)
  return response
}
