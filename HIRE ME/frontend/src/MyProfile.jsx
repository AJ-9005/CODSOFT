import { useLocation, useParams } from "react-router-dom"

function MyProfile({ users, logout, loggeduser, updateSelection }){
    const { userid } = useParams()
    const location = useLocation()
    const jobid = location.state?.viewingjobid
    const currentUser = Object.values(users).find(user => user.id == userid)
    async function handleDecision(status){
        if(!jobid){
            alert("No job found")
            return
        }
        const updatedSelected = {...currentUser.selected, [jobid]:status}
        try {
            const response = await fetch('http://localhost:5000/api/update-selection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: currentUser.username, 
                    selected: newSelected 
                })
            });

            if (response.ok) {
                // Update the local state in App.jsx so the UI changes instantly
                updateSelection(currentUser.username, newSelected);
                alert(status ? "Shortlisted!" : "Removed.");
            }
        } catch (err) {
            alert("Server is down! Decision not saved.");
        }
        }
    return(
        <div className="full">
            <div id="bio">
                {currentUser?.role == "Employer" && (<>
                    <h1 className="heading">Personal Details</h1>
                    <div class="mydetails">
                        <p>Name: {currentUser?currentUser.urname:""}</p>
                        <p>Contact no: {currentUser?currentUser.contactno:""}</p>
                        <p>Account type: {currentUser?currentUser.role:""}</p>
                    </div>
                    <h1 className="heading">Company Details</h1>
                    <div className="mydetails">
                        <p>Name of your Organisation: {currentUser?currentUser.details.companyname:""}</p>
                        <p>Place Of Origin: {currentUser?currentUser.details.origin:""}</p>
                        <p>Established in: {currentUser?currentUser.details.established:""}</p>
                        <p>Website link: {currentUser?currentUser.details.website:"Not Available"}</p>
                    </div>
                </>)}
                {currentUser?.role == "Candidate" && (<>
                    <h1 className="heading">Personal Details</h1>
                    <div class="mydetails">
                        <p>Name: {currentUser?currentUser.urname:""}</p>
                        <p>Date Of Birth: {currentUser?currentUser.details.dob:""}</p>
                        <p>Contact no: {currentUser?currentUser.contactno:""}</p>
                        <p>Account type: {currentUser?currentUser.role:""}</p>
                        <p>Highest qualification: {currentUser?currentUser.details.qualification:""}</p>
                        <p>Skillset: {currentUser?currentUser.details.skillset:""}</p>
                        <p>Work expereince: {currentUser?currentUser.details.expereince:""}</p>
                        <p>Marital Status: {currentUser?currentUser.details.maritalstatus:""}</p>
                    </div>
                    <button className="btn" style={{margin:"15px"}} onClick={() => {
                        if(currentUser?.details?.resume?.url){
                            window.open(currentUser.details.resume.url, "_blank")
                        }
                        else{
                            alert("No resume uploaded!")
                        }
                    }}>View Resume</button>
                </>)}
            </div>
            {loggeduser.role == "Employer" && loggeduser.id != userid &&(
                <div className="decision">
                    <button className="btn" onClick={() => handleDecision(true)} disabled={currentUser?.selected?.[jobid] === true}>Approve</button>
                    <button className="btn" onClick={() => handleDecision(false)} disabled={currentUser?.selected?.[jobid] === false}>Reject</button>
                </div>
            )}
            {loggeduser.id == currentUser.id &&(<button className="btn" style={{margin:"15px", position:"fixed", right:"5px", bottom:"10px "}} onClick={logout}>Logout</button>)}
        </div>
    )
}
export default MyProfile