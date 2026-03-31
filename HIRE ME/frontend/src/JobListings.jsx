import { useState } from "react"
import { useNavigate } from "react-router-dom"
function JobListings({ jobs }){
    const [ search, setsearch ] = useState("")
    const navigate = useNavigate()
    const filteredjobs = jobs.filter(job => 
        job.jobrole.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
    )
    return(
        <div className="full">
            <h1 className="heading">Job Listings</h1>
            <div className="center-items"><input type="text" name="search" placeholder="Search here" onChange={(e) => setsearch(e.target.value)} className="searchbar"/> </div>
            <div className="interface">
                <div className="filters"></div>
                <div className="list">
                {filteredjobs && filteredjobs.length>0?(
                    filteredjobs.map((job, index) => (
                    <div key={job.id || index} className="listbox" onClick={() => navigate(`/jobdetails/${job.id}`)}>
                        <h2>{job.jobrole}</h2>
                        <h3>{job.company}</h3>
                        <div className="badges">
                            <p>{job.workexp}</p>
                            <p>{job.salary}</p>
                            <p>{job.jobtype}</p>
                        </div>
                    </div>
            ))):
            (
                <p style={{ textAlign: 'center', marginTop: '20px' }}> No jobs posted yet. </p>
            )}
            </div>
            </div>
        </div>
    )
}
export default JobListings