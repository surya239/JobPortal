import React from 'react';
import Signup from './Pages/Signup'
import Login from './Pages/Login';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import { PrivateRoute } from './Auth/PrivateRoute';
import Profile from './Pages/ProfileUpdation'
import UpdateStudent from './Pages/Studentupdate'
import StudentDashboard from './Pages/StudentDashboard';
import Alumini from './Pages/Alumini';
import Loding from './Pages/Loding'
import PostJob from './Pages/PostJob';
import EditProfile from './Pages/EditProfile';
import ViewApplication from './Pages/ViewApplicants';
import Home from './Pages/Home';
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact><Home /></Route>
          <Route path='/signup'> <Signup /> </Route>
          <Route path='/login'> <Login /> </Route>
          <PrivateRoute path='/profileUpdation/:uname' ><Profile /></PrivateRoute>
          <PrivateRoute path='/studentProfileUpdation/Student/:uname' ><UpdateStudent /></PrivateRoute>
          <PrivateRoute path='/account/:who/:uname'  ><StudentDashboard /></PrivateRoute>
          <PrivateRoute path='/:categories/account/:who/:uname'  ><StudentDashboard /></PrivateRoute>
          <PrivateRoute path='/recruiterAccount/:uname'><Alumini /></PrivateRoute>
          <PrivateRoute path='/post/recruiterAccount/:uname'><PostJob /></PrivateRoute>
          <PrivateRoute path='/loading'><Loding /></PrivateRoute>
          <PrivateRoute path='/viewApplicants/recruiterAccount/:uname/:id_no/:job_name'><ViewApplication /></PrivateRoute>
          <PrivateRoute path='/EditProfile/Student/:uname'><EditProfile /></PrivateRoute>
        </Switch>
      </Router>
    </>
  );
}

export default App;
