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
  
  const [users, setUsers] = useState({})
  const [jobs, setjobs] = useState([])


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

  const addUser = async (userObject, resumefile) => {
    const finalUser = (userObject.role === "Candidate")
      ? { ...userObject, id: Date.now(), selected: {} }
      : { ...userObject, id: Date.now() };
    const formdata = new FormData()
    if(resumefile){
      formdata.append('resume', resumefile)
    }
    formdata.append('userData', JSON.stringify(finalUser))
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      if (response.ok) {
        const saveduser = data.user
        setUsers((prev) => ({ ...prev, [saveduser.username]: saveduser }));
        setCurrentUser(saveduser);
        setLogIn(true);
        navigate(`/myprofile/${saveduser.id}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

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

  const addJob = async (newJob) => {
    const jobwithUser = {
      ...newJob,
      postedby: currentUser.username,
      company: currentUser.details.companyname, 
      id: Date.now(), 
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
        <Route path="/detailsEntry" element={<DetailsEntry addUser={addUser} />} />
        <Route path="/jobcreator" element={<JobCreator addJob={addJob} />} />
      </Routes>
    </>
  );
}

export default App;