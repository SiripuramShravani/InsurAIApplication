import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    mode:"dark",
    user:null,
    company:null,
    company_details:{},
    claim_status:{},
    get_companies:[],
    userby_policy_number_with_company:null,
    get_file_name_url:{
        message: null,
        url: null,
        name: null
    },
    get_supporting_file_name_url:{
        message: null,
        url: null,
        name: null
    },
    location:null,
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state) => {
            state.mode = state.mode === "light"? "dark" : "light"; 
        },
        setUser : (state,action)=> {
            console.log('in setUser',action.payload)
            const { user, company } = action.payload;
            if (user) {
                state.user = user;
                localStorage.setItem("policy_holder", JSON.stringify(user));
            }
            if (company) {
                state.company = company;
                localStorage.setItem("insured_company", JSON.stringify(company));
            }
        },

        setUserByPolicyNumber : (state,action)=> {
            console.log("in setUserByPolicyNumber", action.payload)
            state.userby_policy_number_with_company=action.payload
        },
        logOut:(state,action) => {
            console.log("in logout reducer")
            state.token = null;
            console.log("in logout reducer",state.token)
            localStorage.setItem("user",false)
        },
        setCompany : (state,action)=> {
            console.log('in setCompany',action.payload)
            state.company = action.payload   
            if(state.company !== undefined)
            localStorage.setItem("insured_company",JSON.stringify(state.company))
        },
        setClaims:(state,action)=>{
            console.log("In set claims",action.payload)
            state.claim_status = action.payload
            
        },
        setCompanyDetails:(state,action)=>{
            console.log("In set company details",action.payload)
            state.company_details = action.payload
            
        },
        setGetCompanyDetails:(state,action)=>{
            console.log("In set get company details",action.payload[0])
            state.get_companies = action.payload[0]
         },
         setGetFileNameUrl: (state, action) => {
            console.log('In set get file name url', action.payload);
            state.get_file_name_url = {
              message: action.payload.message,
              url: action.payload.urls[0],
              name: action.payload.names[0],
            };
          },
          setGetSupportingFileNameUrl: (state, action) => {
            console.log('In set get supporting file name url', action.payload);
            state.get_supporting_file_name_url = {
              message: action.payload.message,
              url: action.payload.urls[0],
              name: action.payload.names[0],
            };
          },
        setLocation:(state,action)=>{
            console.log("Setting location: ",action.payload);
            state.location=action.payload;
        }
    }
})
export const {setMode,setUser,setClaims,setCompany,setCompanyDetails,logOut,setGetCompanyDetails,setUserByPolicyNumber,setGetFileNameUrl,setLocation,setGetSupportingFileNameUrl} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;