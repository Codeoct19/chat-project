import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { GoPencil } from "react-icons/go";
import "./PaginatedTable.css";

export function PaginatedTable ({data, itemsPerPage, handleEdit, handleDelete, action, handleClick}){

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() =>{}, [data]);
  if (!data) {return;}
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-100">
      <div className="col-lg-12">
        <div className="main-box clearfix">
          <div className="table-responsive mt-5">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button variant="success" onClick={handleClick} className="mb-3 btn btn-light btn-primary">
                {action && action === 'country' && 'Add Country' }
                {action && action === 'state' && 'Add State' }
                {action && action === 'city' && 'Add City' }
              </button>
            </div>
            <table id="dtBasicExample" className="table user-list" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  {action && action === 'user' && <>
                    <th><span>User</span></th>
                    <th><span>Email</span></th>
                  </>}
                  {action && action === 'country' && <>
                    <th><span>Countries</span></th>
                  </>}
                  {action && action === 'state' && <>
                    <th><span>Countries</span></th>
                    <th><span>States</span></th>
                  </>}
                  {action && action === 'city' && <>
                    <th><span>Countries</span></th>
                    <th><span>States</span></th>
                    <th><span>Cities</span></th>
                  </>}
                  <th><span>Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.map((data, index) => {
                  const userImg = data.image ? `http://localhost:8080/userImg/images/${data.image}` : `http://localhost:8080/userImg/images/image_1720089642447.png`;
                  return(
                    <tr key={index}>
                      {action === 'user' && <><td><img src={userImg} alt="Img"/> {data.first_name} {data.last_name}</td>
                      <td>{data.email}</td></>}
                      {action === 'country' && <><td>{data.country}</td></>}
                      {action === 'state' && <>
                        <td>{data.country}</td>
                        <td>{data.state}</td>
                      </>}
                      {action === 'city' && <>
                        <td>{data.country}</td>
                        <td>{data.state}</td>
                        <td>{data.city_name}</td>
                      </>}
                      <td className='table-action fs-4'>
                        <GoPencil onClick={() => handleEdit(data)} />
                        <AiOutlineDelete onClick={() => handleDelete(data.id)}/>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-center flex-nowrap paginate-btn">
              <span aria-hidden="true" onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}>&laquo;</span>
                {currentPage > 1 && <button disabled onClick={() => paginate(currentPage - 1)} >{currentPage - 1}</button>}
                <button onClick={() => paginate(currentPage)} >{currentPage}</button>
                {currentPage < totalPages && <button disabled onClick={() => paginate(currentPage + 1)} >{currentPage + 1}</button>}
              <span aria-hidden="true" disabled={currentPage === totalPages} onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}>&raquo;</span>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}
