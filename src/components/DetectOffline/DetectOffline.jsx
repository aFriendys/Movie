import { Detector } from 'react-detect-offline';
import { Alert } from 'antd';

import styles from './DetectOffline.module.css';

function DetectOffline({ children }) {
  return (
    <Detector
      render={({ online }) =>
        online ? (
          children
        ) : (
          <Alert
            className={styles.error}
            message="Error"
            description="Some internet connection problems."
            type="error"
            showIcon
          />
        )
      }
    />
  );
}

export default DetectOffline;
