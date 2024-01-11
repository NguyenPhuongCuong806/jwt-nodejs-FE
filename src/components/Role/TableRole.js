import React, { useEffect, useState } from 'react';
import { fetchAllRole, deleteRole } from '../../services/roleService';
import { toast } from 'react-toastify';

const TableRole = (props) => {


    useEffect(() => {
        props.fetchRoles()
    }, [])



    return (
        <div>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">URL</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.listRoles?.length > 0 ?
                            <>
                                {props.listRoles.map((item, index) => {
                                    return (
                                        <tr key={`row-${index}`}>
                                            <td>{item.id}</td>
                                            <td>{item.url}</td>
                                            <td>{item.description}</td>
                                            <td className='d-flex gap-3'>

                                                <button className='btn btn-danger'
                                                    onClick={() => props.handleDeleteRole(item)}
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
                                    <td colSpan={4}>
                                        not found role
                                    </td>
                                </tr>
                            </>
                    }

                </tbody>
            </table>
        </div>
    );
};

export default TableRole;