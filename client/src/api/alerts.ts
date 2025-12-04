import axios from './axios'

export const triggerManualAlerts = async () => {
    return await axios.post('/alerts/test')
}
