import axiosInstance from './axios';
import user from '@/services/user';

export default {
    users: user(axiosInstance)
}