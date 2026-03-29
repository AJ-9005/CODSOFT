import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function DetailsEntry({ addUser, login }){
    const location = useLocation()
    const navigate = useNavigate()
    const basicInfo = location.state?.basicInfo
    const [companyDetails, setCompanyDetails] = useState({
        companyname: "",
        origin: "",
        established: null,
        website: "",
    })
    const [applicantdetails, setapplicantdetails] = useState({
        qualification:"",
        dob: "",
        skillset:"",
        expereince:"",
        maritalstatus:"",
        resume: null,
    })
    function handleChange(e){
        const { name, value, type, files } = e.target
        const finalValue = type == "file"
        ?{name: files[0].name, url: URL.createObjectURL(files[0])}:value
        if(basicInfo.role == "Employer"){
            setCompanyDetails((prev) => ({
            ...prev, [name]: finalValue,
        }))
        }
        else{
            setapplicantdetails((prev) => ({
            ...prev, [name]: finalValue,
        }))
        }
    }
    function handleSubmit(e){
        e.preventDefault()
        let finalData = {}
        if (basicInfo.role == "Employer"){
            finalData = {
                ...basicInfo,
                details: companyDetails
            }
        }
        else{
            finalData = {
                ...basicInfo,
                details: applicantdetails
            }
        }
        addUser(finalData)
        navigate("/login")
        alert("Registered Succesfully! Please Login.")
    }
    return(<div className="full">
        {basicInfo?.role == "Employer" && (<div className="formwrapper">
            <form action="" method="POST" className="loginform" onSubmit={handleSubmit}>
                <label for="compname">Name of your organisation</label>
                <input type="text" id="compname" name="companyname" onChange={handleChange} required /><br />
                <label for="origin">Place of Origin Of the Organisation (City, Country)</label>
                <input type="text" id="origin" name="origin" onChange={handleChange} required /><br />
                <label for="established">Year Founded</label>
                <input type="text" id="established" name="established" onChange={handleChange} required /><br />
                <label for="weblink">Website Link (If any)</label>
                <input type="text" id="weblink" name="weblink" onChange={handleChange} /><br />
                <button className="btn" type="submit">Submit</button>
            </form>
        </div>)}
        {basicInfo?.role == "Candidate" && (<div className="formwrapper">
            <form action="" method="POST" className="loginform" onSubmit={handleSubmit}>
                <label for="qualification">Highest qualification</label>
                <input type="text" id="compname" name="qualification" onChange={handleChange} required /><br />
                <label for="dob">Date Of Birth(dd/mm/yyyy)</label>
                <input type="text" name="dob" onChange={handleChange}/>
                <label for="skillset">Skills (Any 5)</label>
                <input type="text" id="origin" name="skillset" onChange={handleChange} required /><br />
                <label for="expereince">Prior work expereince (if any)</label>
                <textarea name="expereince" id="" onChange={handleChange}></textarea><br />
                <label for="maritalstatus">Marital Status</label>
                <label for="married"><input type="radio" name="maritalstatus" value="Married" onChange={handleChange}/>Married <input type="radio" name="maritalstatus" value="Unmarried" onChange={handleChange}/>Unmarried</label>
                <label htmlFor="resume">Resume (PDF only)</label>
                <input type="file" name="resume" accept=".pdf" onChange={handleChange} /><br />
                <button className="btn" type="submit">Submit</button>
            </form>
        </div>)}
    </div>)
}
export default DetailsEntry