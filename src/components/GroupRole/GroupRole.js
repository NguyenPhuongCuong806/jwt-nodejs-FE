import React, { useEffect, useState } from 'react';
import './GroupRole.scss'
import { fetchAllgroup } from '../../services/userService';
import { fetchAllRole, getRoleByGroup, assignRolesToGroup } from '../../services/roleService';
import _ from 'lodash';
import { toast } from 'react-toastify';

const GroupRole = () => {

    const [userGroup, setuserGroup] = useState([]);
    const [listRoles, setlistRoles] = useState([]);
    const [selectGroup, setselectGroup] = useState("");

    const [assignRoleByGroup, setassignRoleByGroup] = useState([]);

    const getGroups = async () => {
        let res = await fetchAllgroup();
        if (res && res && res.EC === 0) {
            setuserGroup(res.DT)
            // if (res.DT && res.DT.length > 0) {
            //     let groups = res.DT
            //     setuserData({ ...userData, group: groups[0].id })
            // }
        }
    }



    const fetchRoles = async () => {
        let res = await fetchAllRole();
        if (res && res.EC === 0) {
            setlistRoles(res.DT)
        }
    }

    const getRolebyGroupId = async (id) => {
        let res = await getRoleByGroup(id);
        if (res && res.EC === 0) {
        }
    }

    useEffect(() => {
        getGroups();
        fetchRoles();
    }, [])

    const handleOnChangeInput = async (value) => {
        setselectGroup(value)
        if (value) {
            getRolebyGroupId(value);
            let res = await getRoleByGroup(value);
            if (res && res.EC === 0) {
                let data = builDataRoleByGroup(res.DT.Roles, listRoles)
                setassignRoleByGroup(data)
            }
        }
    }

    const builDataRoleByGroup = (groupRole, AllRoles) => {
        let result = [];
        if (AllRoles.length > 0) {
            AllRoles.map(role => {
                let object = {};
                object.id = role.id
                object.url = role.url;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRole && groupRole.length > 0) {
                    object.isAssigned = groupRole.some(item => item.url === object.url);
                }
                result.push(object);


            })
        }

        return result;
    }

    const handleOnChangeSelect = (value) => {
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
        let foundIndex = _assignRoleByGroup.findIndex(item => +item.id === +value);
        if (foundIndex !== -1) {
            _assignRoleByGroup[foundIndex] = { ..._assignRoleByGroup[foundIndex], isAssigned: !_assignRoleByGroup[foundIndex].isAssigned }
        }
        setassignRoleByGroup(_assignRoleByGroup)
    }

    const buildDataToSave = () => {
        let result = {};
        const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);

        result.groupId = selectGroup;
        let groupRoles = _assignRoleByGroup.filter(item => item.isAssigned === true);
        let finalgrouprole = groupRoles.map((item) => {
            let items = {
                groupId: selectGroup,
                roleId: +item.id
            };
            return items;
        })

        result.groupRoles = finalgrouprole;
        return result;
    }

    const handleSave = async () => {
        let data = buildDataToSave();
        let res = await assignRolesToGroup(data)
        if (res && res.EC === 0) {
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }


    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='title mt-3'>
                    <h4>Group Role:</h4>
                </div>
                <div className='assign-group-role'>
                    select group:
                    <div className='col-12 col-sm-6 form-group'>
                        <label>Group (<span className='reds'>*</span>) :</label>
                        <select
                            className={'form-select'}
                            onChange={(e) => handleOnChangeInput(e.target.value)}
                        >

                            <option value="">Please select your group</option>


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
                <hr />
                {
                    selectGroup &&
                    <div className='roles'>
                        <h5>Assign Roles:</h5>
                        {
                            assignRoleByGroup && assignRoleByGroup.length > 0 &&
                            assignRoleByGroup.map((item, index) => {
                                return (
                                    <div class="form-check" key={`list-roles-${index}`}>
                                        <input className="form-check-input"
                                            type="checkbox"
                                            value={item.id}
                                            id={`list-roles-${index}`}
                                            checked={item.isAssigned}
                                            onChange={(e) => handleOnChangeSelect(e.target.value)}
                                        />
                                        <label class="form-check-label" htmlFor={`list-roles-${index}`}>
                                            {item.url}
                                        </label>
                                    </div>
                                )
                            })
                        }

                    </div>
                }
                <div className='mt-3'>
                    <button className='btn btn-warning'
                        onClick={() => handleSave()}
                    >Save</button>
                </div>

            </div>
        </div >
    );
};

export default GroupRole;