import { useState } from "react"
import { useNavigate } from "react-router-dom"

function JobCreator({ addJob }){
    const navigate = useNavigate()
    const [jobdetails, setjobdetails] = useState({
        jobrole:"",
        salary:"",
        location:"",
        jobtype: "",
        education: "",
        skills: "",
        workexp:"",
        desription:"",
        postedby: "",
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setjobdetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    function postJob(e){
        e.preventDefault()
        addJob(jobdetails)
        navigate("/creations")
        alert("Job created!")
    }
    return(
        <div className="full">
            <div className="formwrapper">
                <form action="" method="POST" className="loginform" onSubmit={postJob}>
                    <label for="jobrole">Job Role:</label>
                    <input type="text" name="jobrole" onChange={handleChange}/>
                    <label for="salary">Salary Provided</label>
                    <input type="number" name="salary" onChange={handleChange}/>
                    <label for="location">Location</label>
                    <input type="text" name="location" onChange={handleChange}/>
                    <label>Job type</label>
                    <label for="jobtype"><input type="radio" name="jobtype" value="Part-time" onChange={handleChange}/>
                        Part-Time
                    <input type="radio" name="jobtype" value="Full-time" onChange={handleChange}/>
                    Full-Time
                    </label>
                    <label for="workexp">Required Qualification (Highest)</label>
                    <input type="text" name="education" onChange={handleChange}/>
                    <label for="workexp">Required Skills</label>
                    <input type="text" name="skills" onChange={handleChange}/>
                    <label for="workexp">Required Work Expereince</label>
                    <input type="text" name="workexp" onChange={handleChange}/>
                    <label for="description">Description</label>
                    <input type="textarea" name="description" onChange={handleChange}/>
                    <button type = "submit" className="btn" style={{alignSelf:"center", margin: "15px"}}>Post</button>
                </form>
            </div>
        </div>
    )
}
export default JobCreator