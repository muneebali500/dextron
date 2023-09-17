import "./loader.css";
import loader from "@assets/loader.svg";

//========================== THIS IS Spinner COMPONENT ======================
const Spinner = ({ type }) => {
  //================== FIXED ===========================
  if (type === "fixed") {
    return (
      <div className="fixed-loading-wrapper">
        <div className="loader-wrap">
          <div className="loader-logo">
            <img src={loader} alt="Vultron" width="" height="" />
          </div>
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  //========================== NORMAL WEB LOADER =====================
  else if (type === "webLoader") {
    return (
      <div className="fixed-loading-wrapper web-loader">
        <img src={loader} alt="Vultron" width="" height="" />
      </div>
    );
  }
  //=========== JUST SPINNER ==========
  if (type === "spinner") {
    return (
      <div className="loading-wrapper sm_spinner">
        <div className="loader-wrap">
          <div className="loader"></div>
        </div>
      </div>
    );
  }
  //=========== SPINNER ==========
  return (
    <div className="loading-wrapper">
      <img src={loader} alt="Vultron" width="" height="" />
    </div>
  );
};

export default Spinner;
