import { Alert, AlertColor } from '@mui/material';
import { useAlert } from '../../../Contexts/AlertContext';

function getSeverity(sev: string): AlertColor {
  switch (sev.toLowerCase()) {
    case 'success':
      return 'success';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      throw new Error(`${sev} is not a valid alert color`);
  }
}

export default function AlertPopup() {
  const { text, type } = useAlert();
  if (text && type) {
    return (
      <Alert
        severity={getSeverity(type)}
        sx={{
          position: 'absolute',
          alignItems: 'center',
          right: '10px',
          top: '10px',
          backgroundColor: 'var(--gray2)',
          color: 'var(--white-color)',
          fontSize: '1.25rem',
          lineHeight: '2rem',
          boxShadow: '3px 5px 5px hsl(164.21 100% 7.45%)',
        }}
      >
        {text}
      </Alert>
    );
  } else {
    return <></>;
  }
}
