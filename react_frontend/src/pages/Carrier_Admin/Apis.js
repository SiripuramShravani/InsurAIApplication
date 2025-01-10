import axios from "axios";
export const fetchCompanyData = async () => {
    try {
        // Logic to get company data. 
        // Since you already do this in CarrierAdminIndividualLayout, 
        // you can probably reuse that logic.
        const companyString = localStorage.getItem('carrier_admin_company');
        if (companyString) {
            return JSON.parse(companyString);
        } else {
            throw new Error("Company data not found in local storage");
        }
    } catch (error) {
        console.error("Error fetching company data:", error);
        throw error;
    }
};


 
export const fetchDashboardData = async (companyId) => {

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });

  console.log("id in api", companyId);
  const formData = new FormData();
  formData.append('ic_id', companyId);

  try {
    const response = await axiosInstance.post('get_all_details/', formData);
    console.log(response); 
    return response.data; // Return data here

  } catch (error) {
    console.log("error", error);
    console.error("Error fetching dashboard data:", error);
    throw error; // Re-throw for better error propagation
  }
};

export const fetchPoliciesData = async (companyId) => {
    // ... (Your API logic for fetching policies)
};

export const fetchClaimsData = async (companyId) => {
    // ... (Your API logic for fetching claims)
};

// ... (Add API functions for agents, reports, etc.)