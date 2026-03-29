import { useState } from 'react'
import { Routes, Route, useNavigate, useResolvedPath } from 'react-router-dom'
import Landing from './Landing'
import React from 'react'
import Navbar from './Navbar'
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
  const [users, setUsers] = useState({
    "google_hr": {
    id: 102,
    username: "google_hr",
    password: "123",
    urname: "Sundar Pichai",
    contactno: "9876543210",
    role: "Employer",
    details: {
      companyname: "Google LLC",
      origin: "Mountain View, USA",
      established: "1998",
      website: "https://google.com"
    }
  },

  // 2. DEFAULT CANDIDATE
  "dev_rahul": {
    username: "dev_rahul",
    password: "123",
    urname: "Rahul Sharma",
    contactno: "8888877777",
    role: "Candidate",
    id:101,
    details: {
      qualification: "B.Tech CSE",
      dob: "15/08/2003",
      skillset: "React, Node.js, MongoDB, Python",
      expereince: "6-month internship at CodSoft",
      maritalstatus: "Unmarried",
      resume: null // Note: Blobs can't be hardcoded easily, so keep this null
    }
  }
  })
  const [jobs, setjobs] = useState([
    {
    id: 101,
    jobrole: "Frontend Developer",
    company: "Google LLC",
    salary: "15000",
    location: "Bangalore (Remote)",
    description: "Looking for a React expert to build amazing UIs.",
    postedby: "google_hr",
    applicants:[],
  }
  ])
  console.log(users)
  const addUser = (userObject) => {
    userObject = (userObject.role == "Candidate")?{...userObject, id: Date.now(), selected: {}}: {...userObject, id:Date.now()}
    setUsers((prevUsers) => ({
      ...prevUsers,
      [userObject.username]: userObject,
    }))
  }
  const [currentUser, setCurrentUser] = useState(null)
  function login(username, password){
    const usertologin = users[username]
    if(usertologin){
      if(password == usertologin.password){
        setCurrentUser(usertologin)  
        setLogIn(true)            
        navigate(`/myprofile/${usertologin.id}`)
      }
      else{
        return
      }
    }
  }
  function addJob(newJob){
    const jobwithUser = {
      ...newJob,
      postedby: currentUser.username,
      company: currentUser.details.comapnyname,
      id: Date.now,
      applicants:[],
    }
    setjobs((prev) => ([...prev, jobwithUser]))
  }
  function logout(){
    setLogIn(false)
    setCurrentUser(null)
    navigate("/")
    alert("Logged out succesfully!")
  }
  function applytojob(jobID, user){
    setjobs((prev) => (
      prev.map((job) => {
        if(job.id == jobID){
          if(!job.applicants.includes(user)){
            return {...job, applicants:[...job.applicants, user]}
          }
          else{
            return job
          }
        }
      })
    ))
  }
  function updateSelection(username, newSelected){
    setUsers((prev) => ({
      ...prev,
      [username]: {
        ...prev[username],
        selected:newSelected
      }
    }))
  }
  return (
    <>
    <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser}/>
        <Routes>
          <Route path="/" element={<Landing isLoggedIn={isLoggedIn}/>}></Route>
          <Route path="/login" element={<LoginPage addUser={addUser} login={login}/>}></Route>
          <Route path="/jobs" element={<JobListings jobs={jobs}/>}></Route>
          <Route path="/creations" element={<Creations jobs={jobs} currentUser={currentUser}/>}></Route>
          <Route path="/myprofile/:userid" element={<MyProfile users={users} logout={logout} loggeduser={currentUser} updateSelection={updateSelection}/>}></Route>
          <Route path="/jobdetails/:jobID" element={<JobProfile jobs={jobs} currentUser={currentUser} applytojob={applytojob} hasApplied={hasApplied} sethasApplied={sethasApplied}/>}></Route>
          <Route path="/detailsEntry" element={<DetailsEntry addUser={addUser} login={login}/>}></Route>
          <Route path="/jobcreator" element={<JobCreator addJob={addJob}/>}></Route>
        </Routes>
    </>
  )
}

export default App
