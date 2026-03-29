import { useNavigate } from "react-router-dom"
function JobListings({ jobs }){
    const navigate = useNavigate()
    return(
        <div className="full">
            <h1 className="heading">Job Listings</h1>
            <div className="interface">
                <div className="filters"></div>
                <div className="list">
                {jobs && jobs.length>0?(
                    jobs.map((job, index) => (
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