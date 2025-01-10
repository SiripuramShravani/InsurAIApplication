// import { Outlet, Navigate } from "react-router-dom";
// import { useEffect, useRef, useState } from 'react';
// import { useRefreshMutation } from "../state/authApiSlice";
// import usePersist from "./usePersist";
// import { useSelector } from 'react-redux';
// import { selectCurrentToken } from "../state/authSlice";

// const PersistLogin = () => {
//     const [persist] = usePersist();
//     const token = useSelector(selectCurrentToken);
//     const effectRan = useRef(false);
//     const [trueSuccess, setTrueSuccess] = useState(false);
//     const [refresh, { isLoading, isSuccess, isError, error }] = useRefreshMutation();

//     const verifyRefreshToken = async () => {
//         try {
//             const response = await refresh();
//             setTrueSuccess(true);
//             // eslint-disable-next-line no-unused-vars
//             const { accessToken } = response.data; // To remove 'response is assigned a value but never used' warning
//         } catch (err) {
//             console.error("persist error", err);
//         }
//     };
    
//     useEffect(() => {
//         const refreshIfRequired = async () => {
//             if (!effectRan.current || process.env.NODE_ENV === 'development') {
//                 verifyRefreshToken();
//                 if (!token && persist) verifyRefreshToken();
//             }
//             effectRan.current = true;
//         };

//         refreshIfRequired();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     if (!persist || (effectRan.current && process.env.NODE_ENV !== 'development')) {
//         return <Outlet />;
//     } else if (isLoading) {
//         return <p>Loading...</p>;
//     } else if (isError) {
//         return (
//             <p className='errmsg'>
//                 {error.data?.message}
//                 <Navigate to="/">Please login again</Navigate>.
//             </p>
//         );
//     } else if (isSuccess && trueSuccess) {
//         return <Outlet />;
//     } else if (token && !isLoading) {
//         return <Outlet />;
//     }

//     return null;
// };

// export default PersistLogin;
