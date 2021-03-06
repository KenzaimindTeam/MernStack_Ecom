import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import MerchantContext from "../../context/MerchantContext";
import ErrorMessage from "../misc/ErrorMessage";
import Pagination from "./Pagination";

function ProductsLists() {
  const [merchant, setMerchant] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [products, setProducts] = useState([]);
  

  let navigate = useNavigate();

  async function logout() {
    await Axios.get("http://localhost:5000/auth/logOut");
    navigate("/");
  }

  async function deleteProductList(id) {
    if (window.confirm("Do you want to delete this Product lists?"))
      await Axios.delete(`http://localhost:5000/product/${id}`);
    alert("Product list deleted successfully");
    getProducts();
  }

  async function getMerchant() {
    const merchantRes = await Axios.get(
      "http://localhost:5000/authMerchant/merchantProfile"
    );

    setMerchant(merchantRes.data);
  }

  const [data, setData] = useState([]); 
  const [perpage, setPerpage] = useState([]);
  const itemsUrl = 'http://localhost:5000/product/productsLists';
  useEffect(() => { 
    Axios.get(`${itemsUrl}`).then(
      res => { setData(res.data); setPerpage(res.data.slice(0, 2)); } 
    )
    getProducts();
  }, [])
  const pageHandler = (pageNumber) => {
    setPerpage(data.slice((pageNumber * 2) - 2, pageNumber * 2)); 
  }

  async function getProducts() {
    const productsRes = await Axios.get(
      "http://localhost:5000/product/productsLists"
    );
    setProducts(productsRes.data);
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

                  {/*    <form className="form-inline">
                        <button
                          className="btn  my-2 my-sm-0 nav_search-btn"
                          type="submit"
                        >
                          <i className="fa fa-search" aria-hidden="true" />
                        </button>
  </form> */}
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
                          <Link className="nav-link" to="/productsLists">
                            View List
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
                    <form
                      className="form"
                      id="form"
                      encType="multipart/form-data"
                    >
                      <div  >


                        {data.length >= 1 ?
                          <div >
                            <div>
                              <table className="table">
                                <thead className="thead-dark">
                                  <tr key="index">
                                    <th>Category Name</th>
                                    <th>Machine name</th>
                                    <th>Cost</th>
                                    <th>Weight</th>
                                    <th>Quantity</th>
                                    <th>Offer</th>
                                    <th>Total Amount</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>
                                {perpage.map((product, i) => {
                                  return (
                                    <tbody>
                                      <tr i={product._id}>
                                        {/* <td>{product._id}</td> */}
                                        <td>{product.catgname}</td>

                                        <td>{product.machname}</td>
                                        <td>{product.cost}</td>
                                        <td>{product.weight}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.offer}</td>
                                        <td>{product.totalamount}</td>
                                        <td>
                                          <Link
                                            className="btn btn-primary"
                                            to={`/editProduct/${product._id}`}
                                            key={i}
                                            product={{ product }}
                                            getProducts={{ getProducts }}
                                          >
                                            Edit
                                          </Link>
                                        </td>
                                        <td>
                                          <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() =>
                                              deleteProductList(product._id)
                                            }
                                          >
                                            Delete
                                          </button>
                                        </td>

                                      </tr>
                                    </tbody>
                                  );
                                })}
                              </table>
                              <br />
                              <br />

                            </div>

                          </div>
                          :
                          <p>data not loaded</p>
                        }
                        <br />
                        <Pagination data={data} pageHandler={pageHandler} />
                      </div><br />
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
                    ?? <span id="displayYear" /> All Rights Reserved By
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

export default ProductsLists;
