import React, { useEffect } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/Profile/UserProfile";
import "./App.css";
import CreatePost from "./components/CreatePost/CreatePost";
import { useDispatch } from "react-redux";
import { userActions } from "./components/actions/userActions";
import SubscribedPosts from "./components/SubscribedPost/SubscribedPosts";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import NewPassword from "./components/NewPassword/NewPassword";

function App() {
  const Routing = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = localStorage.getItem("user");
    useEffect(() => {
      if (typeof user === "string") {
        const parseUser = JSON.parse(user);
        dispatch(userActions(parseUser));
        //history.push("/");
      } else if (typeof user === "object") {
        dispatch(userActions(user));
      } else if (!history.location.pathname.startsWith("/resetPassword")) {
        history.push("/signin");
      } else {
        return;
      }
    }, []);
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/subscribedPosts" component={SubscribedPosts} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/:userId" component={UserProfile} />
        <Route exact path="/createPost" component={CreatePost} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/resetPassword/:token" component={NewPassword} />
        <Route component={NotFound} />
      </Switch>
    );
  };

  return (
    <BrowserRouter>
      <Header />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
