import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
function JobProfile({ jobs, currentUser, applytojob }){
    const { jobID } = useParams()
    const navigate = useNavigate()
    const job = jobs?.find(j => j.id == jobID)
    const [view, setview] = useState(false)
    const isOwner = currentUser?.username == job?.postedby
    const status = currentUser?.selected?.[jobID]
    const statusText = status == true ? "Approved":status == false? "Rejected": "Pending"
    const hasApplied = status?status:true
    function handleApply(){
        if(!currentUser){
            alert("Please login to apply!")
            navigate("/login")
        }
        applytojob(job.id, currentUser)
        sethasApplied(true)
        alert("Applied succesfully!")
    }
    return(
        <div className="full center-items">
            <h1 className="heading">Job Details</h1>
            <div className="details">
                <div className="detail">
                    <span>Title: </span>
                    <p>{job?.jobrole}</p>
                </div>
                <div className="detail">
                    <span>Company: </span>
                    <p>{job?.company}</p>
                </div>
                <div className="detail">
                    <span>Salary: </span>
                    <p>{job?.salary}</p>
                </div>
                <div className="detail">
                    <span>Location: </span>
                    <p>{job?.location}</p>
                </div>
                <div className="detail">
                    <span>Type: </span>
                    <p>{job?.jobtype}</p>
                </div>
                <div className="detail">
                    <span>Highest required qualification: </span>
                    <p>{job?.education}</p>
                </div>
                <div className="detail">
                    <span>Skills: </span>
                    <p>{job?.skills}</p>
                </div>
                <div className="detail">
                    <span>Prior work expereince required: </span>
                    <p>{job?.expereince}</p>
                </div>
                <div className="detail">
                    <span>Description: </span>
                    <p>{job?.description}</p>
                </div>
                {isOwner && !view && (<button className="btn" style={{alignSelf:"center", marginTop:"15px"}} onClick={() => setview(true)}>View Applications</button>)}
                {view && (
                    <div className="list">
                    {job.applicants.map((appli, index) => (
                        <div className="listbox" key={index} onClick={() => navigate(`/myprofile/${appli.id}`, {state:{viewingjobid: jobID}})}>
                            <h2>{appli.urname}</h2>
                        </div>
                    ))}
                </div>
                )}
                {currentUser?.role == "Candidate" &&(<>
                    <button className="btn" onClick={handleApply} disabled={hasApplied} style={{backgroundColor:hasApplied?"gray":"", alignSelf:"center"}}>{hasApplied ? "Applied":"Apply Now!"}</button>
                {hasApplied &&(
                    <span style={{textAlign:"center"}}>Status: <span style={{color: status==true?"green":status==false?"red":"orange", marginTop:"15px"}}>{statusText}</span></span>
                )}</>)}
            </div>
        </div>
    )
}
export default JobProfile