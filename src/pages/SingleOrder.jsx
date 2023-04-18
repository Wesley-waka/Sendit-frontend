import React from "react";
import SingleOrderUser from "../components/SingleOrderUser";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import UserFeed from "../components/UserFeed";

function SingleOrder() {
  return (
    <div>
      <Nav />
      <div className="container mx-auto"><SingleOrderUser /></div>
      <UserFeed />
      <Footer />
    </div>
  );
}

export default SingleOrder;
