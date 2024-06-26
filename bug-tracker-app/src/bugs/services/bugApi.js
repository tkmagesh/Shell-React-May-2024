import axios from "axios";

// import from configuration
let serviceEndPoint = 'http://localhost:3030/bugs'

async function getAll(){
    const response = await axios.get(serviceEndPoint)
    return response.data;
}

async function save(bugData){
    if (bugData.id === 0){
        const response = await axios.post(serviceEndPoint, bugData)
        return response.data
    } else {
        const response = await axios.put(`${serviceEndPoint}/${bugData.id}`, bugData)
        return response.data
    }
}

async function remove(bugData){
    const response = await axios.delete(`${serviceEndPoint}/${bugData.id}`);
    return response.data;
}

export default { getAll, save, remove }