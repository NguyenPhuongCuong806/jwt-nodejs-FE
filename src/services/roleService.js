import axios from "../setup/axios"

const createNewRole = (role) => {
    return axios.post("/api/role/create", [...role])
}

const fetchAllRole = () => {
    return axios.get("/api/role/show");
}

const deleteRole = (role) => {
    return axios.delete(`/api/role/delete`, { data: { id: role.id } });
}

const getRoleByGroup = (groupId) => {
    return axios.get(`/api/role/by-group/${groupId}`);

}

const assignRolesToGroup = (data) => {
    return axios.post("/api/role/assign-to-group", { ...data })
}

export {
    createNewRole, fetchAllRole, deleteRole, getRoleByGroup, assignRolesToGroup
}