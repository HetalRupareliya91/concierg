const EmergencyPopup = function () {
  let emergencyPopupShowed = false;

  function getEmergencyPopupStatus() {
    return emergencyPopupShowed;
  }

  function setEmergencyPopupStatus(status) {
    emergencyPopupShowed = status;
  }

  return {
    getEmergencyPopupStatus,
    setEmergencyPopupStatus,
  };
};

export default EmergencyPopup();
