import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignUp } from './components/SignUp.jsx';
import { SignIn } from './components/SignIn.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { CreateEmployee } from './components/CreateEmployee.jsx';
import { EmployeeList } from './components/EmployeeList.jsx';
import { NotFound } from './components/NotFound.jsx';
import { LandingPage } from './components/Landing.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<NotFound />} />
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

