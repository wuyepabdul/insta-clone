import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, withRouter } from "react-router-dom";
import { logout } from "../../helpers/auth";
import { clearAction } from "../actions/userActions";
import { searchResult } from "../api/searchResult";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const state = useSelector((state) => state.user);

  const handleLogout = () => {
    logout(() => {
      dispatch(clearAction());
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      history.push("/signin");
    });
  };

  const handleSearch = (query) => {
    setSearch(query);
    searchResult(query)
      .then((response) => {
        console.log(response.data.user);
        setUserDetails(response.data.user);
      })
      .catch((err) => console.log(err));
  };

  //views
  const showNavigation = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">
        Instagram
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          {state ? (
            <Fragment>
              <li className="nav-item">
                <i
                  className="fas fa-search searchIcon"
                  data-toggle="modal"
                  data-target="#exampleModal"
                ></i>
              </li>
              <li className="nav-item ">
                <Link to="/subscribedPosts" className="nav-link">
                  Subscribed Posts
                </Link>
              </li>
              <li className="nav-item ">
                <Link to="/createPost" className="nav-link">
                  Create Post
                </Link>
              </li>{" "}
              <li className="nav-item ">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item ">
                <button
                  className="btn btn-link text-secondary  text-decoration-none pl-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li className="nav-item ">
                <Link to="/signup" className="nav-link">
                  Signup
                </Link>
              </li>
              <li className="nav-item ">
                <Link to="/signin" className="nav-link">
                  Signin
                </Link>
              </li>{" "}
            </Fragment>
          )}
        </ul>
      </div>
    </nav>
  );

  //render view
  return (
    <header id="header">
      {showNavigation()}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog m">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder=" Search Users"
                  aria-label=" username"
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                  >
                    Search
                  </button>
                </div>
              </div>
              <ul className="list-group">
                {userDetails.map((item) => {
                  return (
                    <Link
                      to={
                        item._id !== state._id
                          ? `/profile/${item._id}`
                          : "/profile"
                      }
                    >
                      {" "}
                      <li keys={item._id} className="list-group-item ">
                        {item.username}
                      </li>{" "}
                    </Link>
                  );
                })}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => setSearch("")}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
