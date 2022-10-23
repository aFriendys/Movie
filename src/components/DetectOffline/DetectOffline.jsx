import { Detector } from 'react-detect-offline';
import { Alert } from 'antd';

function DetectOffline({ children }) {
  return (
    <Detector
      render={({ online }) =>
        online ? children : <Alert message="Error" description="Offline" type="error" showIcon />
      }
    />
  );
}

export default DetectOffline;
