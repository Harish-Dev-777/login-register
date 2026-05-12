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
  console.log("[authApi] Raw response.data type:", typeof response.data, Array.isArray(response.data))
  console.log("[authApi] Raw response.data keys:", response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'N/A')
  
  // Handle both: API might return an array directly OR { data: [...], Count: N }
  let rawUsers
  if (Array.isArray(response.data)) {
    rawUsers = response.data
  } else if (response.data && Array.isArray(response.data.data)) {
    rawUsers = response.data.data
  } else {
    console.error("[authApi] Unexpected response format:", response.data)
    rawUsers = []
  }
  
  const users = rawUsers.map(u => ({
    ...u,
    image: u.profile || u.image
  }))
  console.log("[authApi] Total registered users:", users.length)
  if (users.length > 0) {
    console.log("[authApi] Sample user fields:", Object.keys(users[0]))
  }
  return users

}

/**
 * Post user data to the API.
 * @param {Object} userData - { name, email, mobile, password, image, pdfFile }
 * @returns {Promise} Axios response
 */
export const registerUser = async (userData) => {
  console.log("[authApi] registerUser - Posting new user...")
  // Ensure we send field names the API expects
  // Build the exact registration timestamp
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const registeredAt = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const payload = {
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile,
    phone: userData.mobile, // Mapping mobile to phone just in case
    password: userData.password,
    confirmPassword: userData.password, // Some APIs expect this
    profile: userData.image || "",
    pdfFile: userData.pdfFile || "",
    registeredAt: registeredAt
  }
  const response = await axios.post(API_URL, payload)
  console.log("[authApi] registerUser - Response:", response.data)
  return response
}

/**
 * Update user data via the API.
 * @param {string} id - The user ID
 * @param {Object} userData - { name, email, mobile }
 * @returns {Promise} Axios response
 */
export const updateUser = async (id, userData) => {
  console.log(`[authApi] updateUser - Updating user ${id}...`)
  const url = `${API_URL}/${id}`
  const response = await axios.put(url, userData)
  console.log("[authApi] updateUser - Response:", response.data)
  return response
}

/**
 * Delete a user via the API.
 * @param {string} id - The user ID
 * @returns {Promise} Axios response
 */
export const deleteUser = async (id) => {
  console.log(`[authApi] deleteUser - Deleting user ${id}...`)
  const url = `${API_URL}/${id}`
  const response = await axios.delete(url)
  console.log("[authApi] deleteUser - Response:", response.data)
  return response
}
