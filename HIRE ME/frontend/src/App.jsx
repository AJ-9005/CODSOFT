import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import React from 'react'
import Navbar from './Navbar'
import Landing from './Landing'
import LoginPage from './LoginPage'
import JobListings from './JobListings'
import Creations from './Creations'
import MyProfile from './MyProfile'
import JobProfile from './JobProfile'
import DetailsEntry from './DetailsEntry'
import JobCreator from './JobCreator'

function App() {
  const navigate = useNavigate()
  const [isLoggedIn, setLogIn] = useState(false)
  const [hasApplied, sethasApplied] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Initialize with empty data; useEffect will fill these from db.json
  const [users, setUsers] = useState({})
  const [jobs, setjobs] = useState([])

  // --- 1. INITIAL DATA LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const data = await response.json();
        setUsers(data.users || {});
        setjobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to load database. Is the server running?", err);
      }
    };
    fetchData();
  }, []);

  // --- 2. SIGNUP LOGIC ---
  const addUser = async (userObject) => {
    const finalUser = (userObject.role === "Candidate")
      ? { ...userObject, id: Date.now(), selected: {} }
      : { ...userObject, id: Date.now() };

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUser)
      });
      const data = await response.json();
      if (response.ok) {
        setUsers((prev) => ({ ...prev, [finalUser.username]: finalUser }));
        // Log them in immediately after signup
        setCurrentUser(finalUser);
        setLogIn(true);
        navigate(`/myprofile/${finalUser.id}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // --- 3. LOGIN/LOGOUT ---
  function login(username, password) {
    const usertologin = users[username];
    if (usertologin && usertologin.password === password) {
      setCurrentUser(usertologin);
      setLogIn(true);
      navigate(`/myprofile/${usertologin.id}`);
    } else {
      alert("Invalid username or password");
    }
  }

  function logout() {
    setLogIn(false);
    setCurrentUser(null);
    navigate("/");
    alert("Logged out successfully!");
  }

  // --- 4. JOB CREATION ---
  const addJob = async (newJob) => {
    const jobwithUser = {
      ...newJob,
      postedby: currentUser.username,
      company: currentUser.details.companyname, // Fixed typo: comapnyname -> companyname
      id: Date.now(), // Fixed: added ()
      applicants: [],
    };

    try {
      const response = await fetch('http://localhost:5000/api/add-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobwithUser)
      });
      if (response.ok) {
        setjobs((prev) => [...prev, jobwithUser]);
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  // --- 5. APPLICATION LOGIC ---
  const applytojob = async (jobID, user) => {
    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobID, currentUser: user })
      });

      if (response.ok) {
        setjobs((prev) =>
          prev.map((job) =>
            job.id == jobID ? { ...job, applicants: [...job.applicants, user] } : job
          )
        );
      }
    } catch (err) {
      console.error("Application error:", err);
    }
  };

  // --- 6. SELECTION LOGIC (Employer Decision) ---
  const updateSelection = async (username, newSelected) => {
    try {
      const response = await fetch('http://localhost:5000/api/update-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, selected: newSelected })
      });

      if (response.ok) {
        setUsers((prev) => ({
          ...prev,
          [username]: { ...prev[username], selected: newSelected }
        }));
      }
    } catch (err) {
      console.error("Selection update error:", err);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} />
      <Routes>
        <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<LoginPage addUser={addUser} login={login} />} />
        <Route path="/jobs" element={<JobListings jobs={jobs} />} />
        <Route path="/creations" element={<Creations jobs={jobs} currentUser={currentUser} />} />
        <Route path="/myprofile/:userid" element={<MyProfile users={users} logout={logout} loggeduser={currentUser} updateSelection={updateSelection} />} />
        <Route path="/jobdetails/:jobID" element={<JobProfile jobs={jobs} currentUser={currentUser} applytojob={applytojob} hasApplied={hasApplied} sethasApplied={sethasApplied} />} />
        <Route path="/detailsEntry" element={<DetailsEntry addUser={addUser} login={login} />} />
        <Route path="/jobcreator" element={<JobCreator addJob={addJob} />} />
      </Routes>
    </>
  );
}

export default App;