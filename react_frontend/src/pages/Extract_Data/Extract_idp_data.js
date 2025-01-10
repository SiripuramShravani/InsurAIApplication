// // src/Scanner.js

// import React, { useState, useEffect } from "react";
// import "./Extract.css";

// const ExtractScanner = () => {
//   const [progress, setProgress] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false);

//   useEffect(() => {
//     if (progress < 100) {
//       const interval = setInterval(() => {
//         setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
//       }, 80); // Adjust the speed of progress here (40ms for 4 seconds to reach 100%)

//       return () => clearInterval(interval);
//     } else {
//       setIsCompleted(true);
//     }
//   }, [progress]);

//   const renderDetails = () => {
//     return (
//       <div className="details">
//         {progress >= 25 && (
//           <>
//             <h2 className="ipd-titles Nasaliza">Policy Details</h2>
//             <ul className="idp-data"> 

//             <li >Policy Number<span style={{marginLeft:'58px'}}>:</span> <span className="ans-Data"style={{marginLeft:'20px'}} >HI28001001</span></li>
//             <li >Reported BY<span style={{marginLeft:'75px'}}>:</span><span className="ans-Data" style={{marginLeft:'25px'}}>John Singh</span> </li>
//             <li >
//               Property Address<span style={{marginLeft:'40px'}}>:</span><span className="ans-Data" style={{marginLeft:'25px'}}>123 Main Street Springfield  <span style={{marginLeft:'195px'}}> 62701 Illinois USA</span></span> 
//             </li>
//             </ul>
//           </>
//         )}
//         {progress >= 50 && (
//           <>
//             <h3 className="ipd-titles Nasaliza">Loss Details</h3>
//             <ul className="idp-data">

//             <li >
//               Incident Date <br/> and Time<span style={{marginLeft:'108px'}}>:</span><span className="ans-Data" style={{marginLeft:'18px'}}> 2024-01-05 00:00:00</span>
//             </li>
//             <li >Loss Location<span style={{marginLeft:'80px'}}>:</span><span className="ans-Data" style={{marginLeft:'23px'}}>2023-05-01</span> </li>
//             <li >Type Of Loss<span style={{marginLeft:'85px'}}>:</span><span className="ans-Data" style={{marginLeft:'25px'}}s>fire</span> </li>
//             <li >
//               Description Loss<span style={{marginLeft:'60px'}}>:</span><span className="ans-Data" style={{marginLeft:'25px'}}>Shoot circuit in my house</span> 
//             </li>
//             </ul>
//           </>
//         )}
//         {progress >= 75 && (
//           <>
//             <h3 className="ipd-titles Nasaliza">Report Details</h3>
//             <ul className="idp-data">

//             <li >
//               Police/Fire  Department <br/>Contacted?<span style={{marginLeft:'100px'}}>:</span><span className="ans-Data"style={{marginLeft:'22px'}}>True</span> 
//             </li>
//             <li >Report Number<span style={{marginLeft:'70px'}}>:</span> <span className="ans-Data"style={{marginLeft:'20px'}}> FIRE3727</span></li>
//             <li >Claim Document <span style={{marginLeft:'60px'}}>:</span><span className="ans-Data"style={{marginLeft:'20px'}}> Claim Note.4pdf</span></li>
//             </ul>
//           </>
//         )}
//         {progress >= 100 && (
//           <>
//           <div className="idp_btn">

//             <button className="idp_submit"> Submit Claim</button>
//           </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="scanner-wrapper">
//       <div className="scanner-container">
//         {!isCompleted && <div className="scan-line">
            
//             </div>}
           
//         <div className="details-container">{renderDetails()}</div>
//       </div>
//       <div className="progress-container">
//         <svg className="progress-circle" viewBox="0 0 36 36">
//           <path
//             className="circle-bg"
//             d="M18 2.0845
//             a 15.9155 15.9155 0 0 1 0 31.831
//             a 15.9155 15.9155 0 0 1 0 -31.831"
//           />
//           <path
//             className="circle"
//             strokeDasharray={`${progress}, 100`}
//             d="M18 2.0845
//             a 15.9155 15.9155 0 0 1 0 31.831
//             a 15.9155 15.9155 0 0 1 0 -31.831"
//           />
//           {isCompleted ? (
//             <text x="18" y="20.35" className="checkmark-big">
//               ✔
//             </text>
//           ) : (
//             <text x="18" y="20.35" className="progress-text">
//               {progress}%
//             </text>
//           )}
//         </svg>
//         <div className="progress-titles">
//           <div
//             className={`progress-title ${progress >= 25 ? "completed" : ""}`}
//           >
//             Policy Details <span className="checkmark">✔</span>
//           </div>
//           <div
//             className={`progress-title ${progress >= 50 ? "completed" : ""}`}
//           >
//             Loss Details <span className="checkmark">✔</span>
//           </div>
//           <div
//             className={`progress-title ${progress >= 75 ? "completed" : ""}`}
//           >
//             Report Details <span className="checkmark">✔</span>
//           </div>
//           <div
//             className={`progress-title ${progress >= 100 ? "completed" : ""}`}
//           >
//             Extracted claim FNOL details<span className="checkmark">✔</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExtractScanner;

