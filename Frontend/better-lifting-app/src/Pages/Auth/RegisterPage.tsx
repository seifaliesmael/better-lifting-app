import { useState } from "react";
import { Card, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";

import { attemptRegister } from "../../api/authServices";

interface Props {
  updateView:(page:string) => void;
}

const RegisterPage = ({updateView} : Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {mutate, isPending, error, isError} = attemptRegister();

  const getErrors = (field: string): string[] => {
    if (!isError || !error?.errors) return [];
    
    return Object.entries(error.errors)
    .filter(([key]) => key.toLowerCase().includes(field.toLowerCase()))
    .flatMap(([, messages]) => messages); // fold
  };
    
    const emailErrors = [...getErrors("email"), getErrors("username")];
    const passwordErrors = getErrors("password");
    
    const handleRegister = () => {
      if (isPending) console.log("Pending registration attempt");
      console.log("Registration attempted:", { email, password });
      mutate({payload:{email:email, password:password}, updateView});
    };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold"> Register </h2>

          <Form>
            <Form.Group className="mb-2">
              <Form.Label className="text-muted small fw-bold">Email address</Form.Label>
              <InputGroup>
                <FormControl
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2"
                  isInvalid={emailErrors.length > 0}
                />
              </InputGroup>
            </Form.Group>

            {/* Email errors */}
            {emailErrors.map((error, index) => (
              <div key={index} className="text-danger small">
                {error}
              </div>
            ))}

            <Form.Group className="mb-2">
              <Form.Label className="text-muted small fw-bold">Password</Form.Label>
              <InputGroup>
                <FormControl
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2"
                  isInvalid={passwordErrors.length > 0}
                />
              </InputGroup>
            </Form.Group>

            {/* Password errors */}
            {passwordErrors.map((error, index) => (
              <div key={index} className="text-danger small">
                {error}
              </div>
            ))}

            <Button 
              variant="primary" 
              className="w-100 py-2 mb-4 fw-bold mt-4"
              onClick={() => handleRegister()}
            >
              Register
            </Button>

            <div className="text-center text-muted small">
              Already have an account? <a style={{cursor:"pointer"}} onClick={() => {updateView("loginPage")}} className="text-decoration-none">Log in</a>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;