import React, { useEffect, useState } from 'react';
import './Roles.scss'
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createNewRole, deleteRole, fetchAllRole } from '../../services/roleService';
import TableRole from './TableRole';

const Roles = (props) => {

    const [listRoles, setlistRoles] = useState([]);


    const dataChildDefault = { url: '', description: '', isValidUrl: true }

    const [listChild, setlistChild] = useState({
        child1: dataChildDefault,

    });

    useEffect(() => {
        Object.entries(listChild).map(([key, value]) => (
            console.log(key, value)
        ));
    }, [])

    const handleOnchangeInput = (name, value, key) => {
        let _listChild = _.cloneDeep(listChild);
        _listChild[key][name] = value

        if (value && name === 'url') {
            _listChild[key]['isValidUrl'] = true

        }
        setlistChild(_listChild)
    }

    const handleAddNewInput = () => {
        let _listChild = _.cloneDeep(listChild);
        _listChild[`child-${uuidv4()}`] = dataChildDefault;

        setlistChild(_listChild);
    }

    const handledeletInput = (key) => {
        let _listChild = _.cloneDeep(listChild);
        delete _listChild[key];
        setlistChild(_listChild)
    }

    const buildDataToPersist = () => {
        let _listChild = _.cloneDeep(listChild);

        let result = [];
        let invalidObj = Object.entries(listChild).map(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description
            })
        })

        return result;
    }


    const handleSave = async () => {
        let check = true;
        let invalidObj = Object.entries(listChild).find(([key, child], index) => {
            return child && !child.url;
        })
        if (!invalidObj) {
            let data = buildDataToPersist();
            let res = await createNewRole(data);
            if (res && res.EC === 0) {
                fetchRoles()
                toast.success(res.EM);
            } else {
                toast.error(res.EM)
            }
        } else {
            toast.error('Input URL must not be emtpy...')
            let _listChild = _.cloneDeep(listChild);
            const key = invalidObj[0]
            _listChild[key]['isValidUrl'] = false
            setlistChild(_listChild)
        }
    }

    const fetchRoles = async () => {
        let res = await fetchAllRole();
        if (res && res.EC === 0) {
            setlistRoles(res.DT)
        }
    }

    const handleDeleteRole = async (role) => {
        let res = await deleteRole(role)
        if (res && res.EC === 0) {
            toast.success(res.EM);
            fetchRoles()
        } else {
            toast.error(res.EM)
        }
    }

    return (
        <div className='role-container'>
            <div className='container'>
                <div className='adding-role mt-3'>
                    <div className='title-row'>
                        <h4>Add a new role</h4>
                    </div>
                    <div className='role-parent'>
                        {
                            Object.entries(listChild).map(([key, child], index) => {
                                return (
                                    <div className='role-child row' key={`child-${key}`}>
                                        <div className='col-5 form-group'>
                                            <label>URL:</label>
                                            <input type='text' className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                value={child.url}
                                                onChange={(e) => handleOnchangeInput('url', e.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-5 form-group'>
                                            <label>Description:</label>
                                            <input type='text' className='form-control'
                                                value={child.description}
                                                onChange={(e) => handleOnchangeInput('description', e.target.value, key)}

                                            />
                                        </div>
                                        <div className='col-2 mt-4 actions'>
                                            <i className="fa fa-plus-circle add" onClick={() => handleAddNewInput()}></i>
                                            {
                                                index >= 1 &&
                                                <i className="fa fa-trash delete"
                                                    onClick={() => handledeletInput(key)}
                                                ></i>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div>
                            <button className='btn btn-warning mt-3'
                                onClick={() => handleSave()}
                            >Save</button>
                        </div>

                    </div>
                </div>
                <hr />
                <div className='mt-3'>
                    <h4>List Current Roles</h4>
                    <TableRole
                        handleDeleteRole={handleDeleteRole}
                        fetchRoles={fetchRoles}
                        listRoles={listRoles}
                    />
                </div>
            </div>
        </div>
    );
};

export default Roles;