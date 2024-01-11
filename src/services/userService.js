import axios from "../setup/axios"

const registerNewUser = (email, username, phone, password) => {
    return axios.post('/api/register', {
        email, username, phone, password
    })
}

const loginUser = (valueLogin, password) => {
    return axios.post('/api/login', {
        valueLogin, password
    })
}

const fetchAllUser = (page, limit) => {
    return axios.get(`/api/user/show?page=${page}&limit=${limit}`);
}

const deleteUser = (user) => {
    return axios.delete(`/api/user/delete`, { data: { id: user.id } });
}

const fetchAllgroup = () => {
    return axios.get(`/api/group/show`);
}

const createNewUser = (data) => {
    return axios.post("/api/user/create", { ...data })
}

const updateCurrentUser = (data) => {
    return axios.put("/api/user/update", { ...data })
}

const getUserAccount = () => {
    return axios.get("/api/account");
}

const logoutUser = () => {
    return axios.post('/api/logout');
}

export {
    registerNewUser, loginUser, fetchAllUser, deleteUser, fetchAllgroup, createNewUser,
    updateCurrentUser, getUserAccount, logoutUser
}