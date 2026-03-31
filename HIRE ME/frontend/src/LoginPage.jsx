import { useState } from "react"
import { useNavigate } from "react-router-dom"
function LoginPage({ addUser, login }){
    const [newUser, setnewUser] = useState(false)
    const navigate = useNavigate()
    const [formdata, setformdata] = useState({
        urname: "",
        contactno: "",
        role: "",
        username: "",
        password: "",
    })
    const [passconfirm, setpassconfirm] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name == "confpassword"){
            setpassconfirm(value)
            return
        }
        setformdata((prev) => ({
            ...prev, [name]: value,}))
    }
    const handleRegister = (e) => {
        e.preventDefault()
        console.log(passconfirm)
        console.log(formdata.password)
        if(passconfirm != formdata.password){
            alert("Confirmed password should be the same as initial password!")
            return
        }
        if(newUser){
            // addUser(formdata)
            // setnewUser(false)
            if(formdata.role == "Employer"){
                navigate("/detailsEntry", {state: {basicInfo: formdata}})
            }
            else{
                navigate("/detailsEntry", {state: {basicInfo: formdata}})
            }
        }
        else{
            console.log("Logging in....")
        }
    }
    function handleLogin(){
        const eusername = formdata.username;
        const epassword = formdata.password;
        login(eusername, epassword)
    }
    return(
        <div className="full center-items">
            <div className="login-div">
                {!newUser &&(<>
                    <form action="" method="POST" className="loginform">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" onChange={handleChange} required /><br />
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={handleChange} required /><br />
                </form>
                <button type="submit" className="btn" onClick={handleLogin}>Login</button>
                <p style={{textAlign:"center"}}>Don't have an account? <span id="registerbutton" onClick={() => setnewUser(true)}>Sign-Up</span></p></>
                )}
                {newUser && (
                    <>
                    <form action="" method="POST" className="loginform" onSubmit={handleRegister}>
                        <label for="urname">Your Name</label>
                        <input type="text" id="urname" name="urname" onChange={handleChange} required /><br />
                        <label for="contactno">Contact No</label>
                        <input type="number" id="contactno" name="contactno" onChange={handleChange} required /><br />
                        <label for="role">Role:</label>
                        <label>
                        <input type="radio" name="role" value="Employer" onChange={handleChange} required/>Employer
                        <input type="radio" name="role" value="Candidate" onChange={handleChange} required/>Candidate
                        </label>
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" onChange={handleChange} required /><br />
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" onChange={handleChange} required /><br />
                        <label for="password">Confirm Password</label>
                        <input type="password" name="confpassword" onChange={handleChange} required /><br />
                        <button type="submit" className="btn">Register</button>
                        <p style={{textAlign:"center"}}>Already have an account? <span id="registerbutton" onClick={() => setnewUser(false)}>Sign-In</span></p>
                    </form>
                    </>
                )}
            </div>
        </div>
    )
}
export default LoginPage