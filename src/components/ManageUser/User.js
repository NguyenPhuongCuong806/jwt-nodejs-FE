import React, { useContext, useEffect, useState } from 'react';
import { deleteUser, fetchAllUser } from '../../services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalUser from './ModalUser';
import './ModalUser.scss'
import { UserContext } from '../../context/UserContext';

const User = (props) => {

    const [listUser, setlistUser] = useState([]);
    const [currentPage, setcurrentPage] = useState(1);
    const [currentLimit, setcurrentLimit] = useState(5);
    const [totalPage, settotalPage] = useState(0);

    const [isShowModalUser, setisShowModalUser] = useState(false);

    const [actionModalUser, setactionModalUser] = useState("CREATE");
    const [dataModalUser, setdataModalUser] = useState({});



    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        fetchUsers()

    }, [currentPage])

    const { user } = useContext(UserContext)
    console.log('check login user', user)

    const fetchUsers = async () => {
        let res = await fetchAllUser(currentPage, currentLimit);
        if (res && +res.EC === 0) {
            setlistUser(res.DT?.users);
            settotalPage(res.DT?.totalPages)
        }
    }

    const handlePageClick = async (event) => {
        await setcurrentPage(+event.selected + 1);
    };

    const handleDelete = async (item) => {
        let res = await deleteUser(item);
        if (res && res.EC === 0) {
            await fetchUsers();
            toast.success("delete user success")
        } else {
            toast.error(res.EM)
        }
    }

    const handleClose = async () => {
        setisShowModalUser(false)
        setdataModalUser({});
        await fetchUsers();

    }

    const handleEditUser = async (user) => {
        setdataModalUser(user);
        setisShowModalUser(true);
        setactionModalUser("UPDATE")
    }

    const handleAddNewUser = () => {
        setisShowModalUser(true);
        setactionModalUser("CREATE")
    }

    const handleRefresh = async () => {
        await fetchUsers();
    }

    return (
        <div className='container'>
            <div className='manage-user-container'>
                <div className='user-header'>
                    <div className='title'>
                        <h3>Manager Users</h3>
                    </div>
                    <div className='actions my-3'>
                        <button className='btn btn-success refresh'
                            onClick={() => handleRefresh()}
                        >
                            <i className="fa fa-refresh">
                            </i>
                            Refresh
                        </button>
                        <button className='btn btn-primary'
                            onClick={() => handleAddNewUser()}
                        >
                            <i className="fa fa-plus-circle">
                            </i>
                            Add new user
                        </button>
                    </div>
                </div>
                <div className='user-body'>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Id</th>
                                <th scope="col">Email</th>
                                <th scope="col">UserName</th>
                                <th scope="col">Group</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listUser?.length > 0 ?
                                    <>
                                        {listUser.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <th scope="row">{(currentPage - 1) * currentLimit + index + 1}</th>
                                                    <td>{item.id}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.username}</td>
                                                    <td>{item.Group?.name}</td>
                                                    <td className='d-flex gap-3'>
                                                        <button className='btn btn-warning'
                                                            onClick={() => handleEditUser(item)}
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                            Edit
                                                        </button>
                                                        <button className='btn btn-danger'
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                            Delete
                                                        </button>
                                                    </td>

                                                </tr>
                                            )
                                        })}

                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td>
                                                not found user
                                            </td>
                                        </tr>
                                    </>
                            }

                        </tbody>
                    </table>
                </div>
                {
                    totalPage > 0 &&
                    <div className='user-footers'>
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPage}
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                }

            </div>
            <ModalUser
                handleClose={handleClose}
                show={isShowModalUser}
                fetchUsers={fetchUsers}
                action={actionModalUser}
                dataModal={dataModalUser}
            />
        </div>

    );
};

export default User;