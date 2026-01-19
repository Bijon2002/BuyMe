import { Link } from "react-router-dom";
import Search from "./Search";

export default function Header({ cartItems }) {

  const role = localStorage.getItem("role"); // "user" or "admin"


  


    return (
             <nav className="navbar row d-flex justify-content-between align-items-center">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to="/"><img width="150px" src="./images/logo.png" />
          </Link>
          
        </div>
      </div>

      <Search />
      {/* account symbol to redirect dashboard */}

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <Link to="/cart">
        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">{cartItems.length}</span>
        </Link>

 <Link to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>

         {/* white acccount texts and logo */}
        <span id="account" className="ml-3" style={{ textDecoration: "none", color: "white" }} >Account</span>
        <span className="ml-1" id="cart_count" style={{ backgroundColor: ""  }}>👤</span>
        </Link>


  

      </div>

    </nav>
    )



}