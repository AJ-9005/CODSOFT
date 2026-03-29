import { useNavigate } from "react-router-dom"
function Landing({ isLoggedIn }){
    const navigate = useNavigate()
    function handleClick(path){
        if(!isLoggedIn){
            alert("Please login first.")
            navigate("/login")
        }
        else{
            navigate(path)
        }
    }
    return(
        <div className="wrapper">
            <div className="frontpage">
                <h1>The Best Job-Seeking Platform.</h1>
                <h2>For the minds who create</h2>
                <div className="flex">
                    <button className="btn" onClick={() => handleClick("/jobs")}>Get hired</button>
                    <button className="btn" onClick={() => handleClick("/creations")}>Hire a candidate</button>
                </div>
            </div>            
        </div>
    )
}
export default Landing