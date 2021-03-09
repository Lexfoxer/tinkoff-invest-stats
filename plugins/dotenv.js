import dotenv from 'dotenv';

const envs = dotenv.config()

export default envs.parsed || {};
