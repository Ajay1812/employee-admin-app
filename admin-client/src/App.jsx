import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignUp } from './components/Signup.jsx';
import { SignIn } from './components/SignIn.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { CreateEmployee } from './components/CreateEmployee.jsx';
import { EmployeeList } from './components/EmployeeList.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createemployee" element={<CreateEmployee />} />
        <Route path="/employeelist" element={<EmployeeList />} />
      </Routes>
    </>
  )
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}

