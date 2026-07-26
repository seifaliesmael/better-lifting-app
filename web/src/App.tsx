import {useState } from 'react'
import { Navbar,  handleNav } from './Components/Nav/Navbar'; 
import DarkModeButton from './Components/Nav/DarkModeButton';

function App() {
  const [currView, setCurrView] = useState("Default")
  const renderBody = () => handleNav(currView, setCurrView);

  return (
    <div className="min-h-screen p-4 bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-0"> MesoPal </h1>
          <p className="text-lg italic text-gray-700 dark:text-gray-300"> A better lifting app </p>
        </div>
        <div className="mr-4">
          <DarkModeButton />
        </div>
      </div>

      {/* Nav and Content */}
      <div className="flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-auto shrink-0 pe-3">
          <Navbar updateView={setCurrView} />
        </div>

        <div className="flex-1 flex justify-center">
          {renderBody()}
        </div>

      </div>
    </div>
  ); 
}

export default App
