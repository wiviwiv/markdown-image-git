const axios = require('axios')

axios.defaults.headers = {
    Accept: 'application/vnd.github.v3.raw+json',
    Authorization: `token ${process.env.GIT_TOKEN}`,
}


axios.defaults.baseURL = 'https://api.github.com'


axios.interceptors.request.use(config => {
    config.headers.Authorization = `token ${process.env.GIT_TOKEN}`
    return config
}, () => {})

axios.interceptors.response.use(response => response, handleError);

function handleError(error) {
    if (error.response && error.response.status > 400) {
        console.error('传输文件失败:', error.message, error.response.data)
        process.exit(0)
    } else {
        return Promise.reject(error)
    }
}

module.exports = {
    get: (url, params) => axios.get(url, {
        params
    }),
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
}