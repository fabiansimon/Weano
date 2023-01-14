import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import * as Notifications from 'expo-notifications';

const PushNotificationContext = createContext();

const PushNotificationProvider = ({ children }) => {
  const [uploadId, setUploadId] = useState(null);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const cleanData = () => setUploadId(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    if (
      lastNotificationResponse
            && lastNotificationResponse.notification.request.content.data.upload_reminder_id
    ) {
      const reminderId = lastNotificationResponse.notification.request.content.data.upload_reminder_id;
      setUploadId(reminderId);
    }
  }, [lastNotificationResponse]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    uploadId,
    cleanData,
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
