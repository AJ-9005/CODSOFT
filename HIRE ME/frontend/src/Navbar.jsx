import { useNavigate } from "react-router-dom"
function Navbar({isLoggedIn, currentUser}){
    const title = currentUser?.role == "Employer"?"My Jobs":"My Applications"
    const navigate = useNavigate()
    return(
        <div className="navbar">
            <p onClick={() => navigate("/")}>Home</p>
            <p onClick={() => navigate("/jobs")}>Browse Jobs</p>
            {isLoggedIn && (<p onClick={() => navigate("/creations")}>{title}</p>)}
            {isLoggedIn?(
                <p onClick={() => navigate(`/myprofile/${currentUser.id}`)}>Your profile</p>
            ):(
                <p onClick={() => navigate("/login")}>Sign-In</p>
            )
            }
        </div>
    )
}
export default Navbar