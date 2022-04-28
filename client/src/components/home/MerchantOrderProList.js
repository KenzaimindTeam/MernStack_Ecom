import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MerchantContext from "../../context/MerchantContext";
import ErrorMessage from "../misc/ErrorMessage";

export default function MerchantOrderProList() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [merchant, setMerchant] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);
  let navigate = useNavigate();

  useEffect(
    (id) => {
      fetch(`http://localhost:5000/order/allorders?page=${pageNumber}`)
        .then((response) => response.json())
        .then(({ totalPages, orders }) => {
          setOrders(orders);
          setNumberOfPages(totalPages);
          getMerchant();
        });

      //   console.log("merchantprofile merchant   " + merchant.firstname);
      //   console.log(products.catgname);
    },
    [pageNumber]
  );

  async function getMerchant() {
    const merchantRes = await Axios.get(
      "http://localhost:5000/authMerchant/merchantProfile"
    );

    setMerchant(merchantRes.data);
  }

  async function logout() {
    await Axios.get("http://localhost:5000/auth/logOut");
    navigate("/");
  }

  return (
    <div>
      <div>
        <div className="sub_page">
          <div className="hero_area">
            {/* header section starts */}
            <header className="header_section">
              <div className="container">
                <nav className="navbar navbar-expand-lg custom_nav-container ">
                  <a className="navbar-brand" href="">
                    <img width={250} src="../../images/logo.png" alt="" />
                  </a>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  ></button>
                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <div className="navbar-nav">
                      <li className="nav-item">
                        <Link className="nav-link" to="/merchantDashboard">
                          HOME
                        </Link>
                        {/* <span className="sr-only">(current)</span> */}
                      </li>

                      <li className="nav-item">
                        <Link className="nav-link" to="/merchantContact">
                          CONTACT
                          {/* <span className="sr-only">(current)</span> */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/merchantProfile">
                          Merchant
                        </Link>
                        {/* <span className="sr-only">(current)</span> */}
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" onClick={logout}>
                          Logout
                          {/* <span className="sr-only">(current)</span> */}
                        </a>
                      </li>

                      <form className="form-inline">
                        <button
                          className="btn  my-2 my-sm-0 nav_search-btn"
                          type="submit"
                        >
                          <i className="fa fa-search" aria-hidden="true" />
                        </button>
                      </form>
                    </div>
                  </div>
                </nav>
              </div>
            </header>
            {/* end header section */}
          </div>
          {/* inner page section */}
          <section className="inner_page_head">
            <div className="container_fuild">
              <div className="row">
                <div className="col-md-8">
                  <div className="full">
                    <nav className="navbar navbar-expand-lg custom_nav-container ">
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a className="nav-link" href="">
                            <span className="sr-only">(current)</span>
                          </a>
                        </li>
                      </ul>
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link className="nav-link" to="/allorders">
                            View Orders
                            <span className="sr-only">(current)</span>
                          </Link>
                        </li>
                      </ul>
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a className="nav-link" href="">
                            <span className="sr-only">(current)</span>
                          </a>
                        </li>
                      </ul>
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <a className="nav-link" href="">
                            <span className="sr-only">(current)</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* end inner page section */}
          {/* why section */}
          <section className="why_section layout_padding">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 offset-lg-2">
                  <div className="full">
                    {errorMessage && (
                      <ErrorMessage
                        message={errorMessage}
                        clear={() => setErrorMessage(null)}
                      />
                    )}
                    <br />
                    <h3>Page of {pageNumber + 1}</h3>

                    <form
                      className="form"
                      id="form"
                      encType="multipart/form-data"
                    >
                      <table className="table">
                        <thead className="thead-dark">
                          <tr key="index">
                            <th>Order id</th>
                            <th>Total Amount</th>
                            <th>Created at</th>
                            <th>Accept/Reject</th>
                            {/* <th>Cost</th>
                              <th>Weight</th>
                              <th>Quantity</th>
                              <th>Offer</th>
                              <th>Total Amount</th>
                              <th>Edit</th>
                              <th>Delete</th> */}
                          </tr>
                        </thead>
                        {orders.map((order,id) => {
                          return (
                            <tbody>
                              <tr key={order.id}>
                                <td>{order._id}</td>
                                {/* <td>{product._id}</td> */}
                                <td>{order.amount}</td>

                                <td>{order.createdAt}</td>
                                {/* <td>{product.cost}</td>
                                  <td>{product.weight}</td>
                                  <td>{product.quantity}</td>
                                  <td>{product.offer}</td>
                                  <td>{product.totalamount}</td> */}
                                {/* <td>
                                    <Link
                                      className="btn btn-primary"
                                      to={`/editProduct/${product._id}`}
                                      key={i}
                                      product={{ product }}
                                      getProducts={{ getProducts }}
                                    >
                                      Edit
                                    </Link>
                                  </td> */}
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* end why section */}
          {/* arrival section */}

          {/* footer section */}
          <footer className="footer_section">
            <div className="container">
              <div className="footer-info">
                <div className="col-lg-7 mx-auto px-0">
                  <p>
                    © <span id="displayYear" /> All Rights Reserved By
                    <a href="https://html.design/">Free Html Templates</a>
                    <br />
                    Distributed By{" "}
                    <a href="https://themewagon.com/" target="_blank">
                      ThemeWagon
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
