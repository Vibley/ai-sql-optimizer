import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

<span className={`text-xs ml-3 px-2 py-1 rounded-md border ${
  apiOk===null ? 'border-gray-300 text-gray-600' :
  apiOk ? 'border-green-300 text-green-700' : 'border-rose-300 text-rose-700'
}`}>
  {apiOk===null ? 'Checking API…' : apiOk ? 'API Connected' : 'API Offline'}
</span>


