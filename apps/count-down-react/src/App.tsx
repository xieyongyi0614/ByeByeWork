import { useEffect, useState } from 'react';
import './App.css';
import CountDown from './pages/count-down';
import Setting from './pages/setting';
function App() {
  const [windowType, setWindowType] = useState<string | undefined>(undefined);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const windowType = urlParams.get('windowType') || undefined;
    setWindowType(windowType);
  }, []);

  return (
    <>
      {windowType === 'clock' && <CountDown />}
      {windowType === 'setting' && <Setting />}
    </>
  );
}

export default App;
