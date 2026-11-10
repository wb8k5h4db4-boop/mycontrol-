import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './style.css';
class StorageBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){if(this.state.failed)return <main><section className="card"><h1>Не удалось открыть данные</h1><p className="help">Проверьте свободное место на iPhone и откройте MyControl в обычном режиме Safari. Приложение не удаляло ваши данные.</p><button className="primary" onClick={()=>location.reload()}>Попробовать снова</button><p className="help">Не очищайте данные Safari, если у вас нет резервной копии JSON.</p></section></main>;return this.props.children}
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><StorageBoundary><App/></StorageBoundary></React.StrictMode>);
