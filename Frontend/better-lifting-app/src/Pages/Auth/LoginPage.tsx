import { useState } from "react";
import { Card, Container, Form, FormControl, InputGroup, Button } from "react-bootstrap";

import { attemptLogin } from "../../api/authServices";

interface Props {
  updateView:(page:string) => void;
}

const LoginPage = ({updateView} : Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {mutate, isPending, isError} = attemptLogin();

  const handleLogin = () => {
    if (isPending) console.log("Pending login attempt");
    console.log("Login attempted:", { email, password });
    mutate({payload:{email:email, password:password}, updateView});
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card className="border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold"> Login </h2>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="text-muted small fw-bold">Email address</Form.Label>
              <InputGroup>
                <FormControl
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-2"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-muted small fw-bold">Password</Form.Label>
              <InputGroup>
                <FormControl
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2"
                />
              </InputGroup>
            </Form.Group>

            {/* Login error */}
            {isError ?
              (<p className="text-danger small">
                Invalid username or password.
              </p>)
              : ""
            }

            <Button 
              variant="primary" 
              className="w-100 py-2 mb-4 fw-bold mt-4"
              onClick={() => handleLogin()}
            >
              Log In
            </Button>

            <div className="text-center text-muted small">
              Don't have an account? <a style={{cursor:"pointer"}} onClick={() => {updateView("registerPage")}} className="text-decoration-none">Sign up</a>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;