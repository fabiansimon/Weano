import React, {
  createContext, useContext, useState,
} from 'react';

const PushNotificationContext = createContext();

const PushNotificationProvider = ({ children }) => {
  const [pushNotificationData, setPushNotificationData] = useState(null);

  const updatePushNotificationData = (data) => {
    setPushNotificationData(data);
  };

  const clearPushNotificationData = () => setPushNotificationData(null);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    pushNotificationData,
    updatePushNotificationData,
    clearPushNotificationData,
  };
  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  return context;
};

export default PushNotificationProvider;
