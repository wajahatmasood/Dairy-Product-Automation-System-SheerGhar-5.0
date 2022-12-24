// import "./Loader.css";

// const Loader = () => {
//   return (
//     <div className="loading">
//       <div></div>
//     </div>
//   );
// };

// export default Loader;
import React from "react";
import Lottie from 'react-lottie';
import * as animationData from '../../Lottie/cowLoading.json'
import "./Loader.css";

const Loader = () => {
  
  const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
return (
  <div className='loading'>
    
    <Lottie 
    options={defaultOptions}
      height={200}
      width={200}
    />
  </div>
  
)
}

export default Loader;