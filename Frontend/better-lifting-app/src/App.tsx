import { useContext, useState } from 'react'
import Navbar, { handleNav } from './Components/Navigation';
import { ThemeContext } from './contexts/theme/ThemeContext';
import { Button, Col, Row } from 'react-bootstrap';

function App() {
  const [currView, setCurrView] = useState("Default")
  const {theme, toggleTheme} = useContext(ThemeContext);

  const renderBody = () => handleNav(currView, setCurrView);

  return (
    <div data-bs-theme={theme} className={`p-4 min-vh-100 ${theme === "light" ? "bg-body-secondary text-dark" : "bg-dark-subtle text-white"}`}>
      <Row className="align-items-center">
        <Col>
          <h1 className="fw-bold mb-0"> MesoPal </h1>
          <p className="fs-5" style={{fontStyle:"italic"}}> A better lifting app </p>
        </Col>
        <Col className="text-end me-4">
          <Button onClick={toggleTheme}> Toggle Theme </Button>
        </Col>
      </Row>

      <Navbar updateView={setCurrView} />

      <div className="container d-flex justify-content-center mt-5">
        {renderBody()}
      </div>
      
    </div>
  ); 
}

export default App
