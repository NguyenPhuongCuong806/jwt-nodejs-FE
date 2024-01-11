import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalUser.scss'
import { fetchAllgroup, createNewUser, updateCurrentUser } from '../../services/userService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalUser = (props) => {

    const [userGroup, setuserGroup] = useState([]);
    const { action, dataModal } = props;

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: ''
    }

    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
    }

    const [userData, setuserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault)

    useEffect(() => {
        getGroups()

    }, [])

    useEffect(() => {
        if (action === 'UPDATE') {
            setuserData({ ...dataModal, group: dataModal.Group ? dataModal.Group.id : '' })
        }
    }, [dataModal]);

    useEffect(() => {
        if (action === 'CREATE') {
            if (userGroup && userGroup.length > 0) {
                setuserData({ ...userData, group: userGroup[0].id })
            }
        }
    }, [action])

    const getGroups = async () => {
        let res = await fetchAllgroup();
        if (res && res && res.EC === 0) {
            setuserGroup(res.DT)
            if (res.DT && res.DT.length > 0) {
                let groups = res.DT
                setuserData({ ...userData, group: groups[0].id })
            }
        }
    }

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData)
        _userData[name] = value;
        setuserData(_userData)
    }

    const checkValidateInput = () => {
        if (action === "UPDATE") return true;
        setValidInputs(validInputsDefault);
        let arr = ['email', 'phone', 'password', 'group'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                toast.info(`Empty input ${arr[i]}`);
                let _validInputs = _.cloneDeep(validInputs);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);
                check = false;
                break;
            }
        }

        return check;
    }

    const handleConfirmUser = async () => {
        let check = checkValidateInput()
        if (check === true) {
            let res = action === 'CREATE' ?
                await createNewUser({ ...userData, groupId: userData['group'] }) :
                await updateCurrentUser({ ...userData, groupId: userData['group'] })
                ;
            if (res && res && res.EC === 0) {
                toast.success(res.EM);
                props.handleClose();
                props.fetchUsers();
                setuserData({ ...defaultUserData, group: userGroup && userGroup.length > 0 ? userGroup[0].id : '' })
            } else {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }

    const handleCloseModalUser = () => {
        props.handleClose();
        setuserData(defaultUserData);
        setValidInputs(validInputsDefault);
    }

    return (
        <>
            <Modal size='lg' show={props.show} onHide={() => handleCloseModalUser()} className='modal-user'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>{props.action === 'CREATE' ? 'Create new User' : 'Edit a User'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Email address (<span className='reds'>*</span>) :</label>
                            <input type='email'
                                disabled={action === "CREATE" ? false : true}
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'}
                                value={userData.email}
                                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>phone number (<span className='reds'>*</span>) :</label>
                            <input type='text'
                                disabled={action === "CREATE" ? false : true}
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'}
                                value={userData.phone}
                                onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>User Name:</label>
                            <input type='text'
                                className='form-control'
                                value={userData.username}
                                onChange={(e) => handleOnChangeInput(e.target.value, "username")}

                            />
                        </div>
                        {
                            action === "CREATE"
                            &&
                            <div className='col-12 col-sm-6 form-group'>
                                <label>Password (<span className='reds'>*</span>) :</label>
                                <input type='password'
                                    className={validInputs.password ? 'form-control' : 'form-control is-invalid'}
                                    value={userData.password}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "password")}

                                />
                            </div>
                        }
                        <div className={action === "CREATE" ? 'col-12 col-sm-12 form-group' : 'col-12 col-sm-6 form-group'}>
                            <label>address :</label>
                            <input type='text' className='form-control'
                                value={userData.address}
                                onChange={(e) => handleOnChangeInput(e.target.value, "address")}

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Gender :</label>
                            <select className='form-select'
                                onChange={(e) => handleOnChangeInput(e.target.value, "sex")}
                                value={userData.sex}
                            >
                                <option defaultValue="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Group (<span className='reds'>*</span>) :</label>
                            <select
                                className={validInputs.group ? 'form-select' : 'form-select is-invalid'}
                                onChange={(e) => handleOnChangeInput(e.target.value, "group")}
                                value={userData.group}
                            >
                                {userGroup && userGroup.length > 0 &&
                                    userGroup.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => handleCloseModalUser()}
                    >
                        Close
                    </Button>
                    <Button variant="primary"
                        onClick={() => handleConfirmUser()}
                    >
                        {action === "CREATE" ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
};

export default ModalUser;