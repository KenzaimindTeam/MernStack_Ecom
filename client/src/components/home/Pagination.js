import React from "react";
//import './App.css';
const Pagination = ({ data, pageHandler }) => {
    let pageNumbers = []

    for (let i = 1; i < Math.ceil(data.length / 2) + 1; i++) { 
        pageNumbers.push(i)
    }

    return (
        <div>
          {/*  <nav>
                <ul className="pagination" >
                   <li className="page-link" style={{backgroundColor:'white', color:'red'}} >Previous</li>
                    <li className="page-link" >
                        {pageNumbers.map(page => <div className="pagebutton" style={{display:'inline-block', letterSpacing:'20px', color:'red',}}
                            onClick={() => pageHandler(page)}>{page}</div>

                        )}
                    </li>
                    <li className="page-link" style={{backgroundColor:'white', color:'red'}}>Next</li>
                   
                </ul>
    </nav> */}
             <div className="btn-box">
                <button className="btn-outline-danger" style={{color:'black'}}>
                  Previous
                </button>
                { pageNumbers.map((page => (
                  <div
                  style={{display:'inline-block', letterSpacing:'15px', color:'black', backgroundColor:'white', border:'3px solid #ff0000'  }}
                   
                    
                    onClick={() => pageHandler(page)}>{page}
                  
                    
                  </div>
                )))}
                <button className="btn-outline-danger" style={{color:'black'}}>
                  Next
                </button>
              </div>


        </div>
    )
}
export default Pagination;