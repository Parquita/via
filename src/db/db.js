import postgres from "postgres";

const conectionString = process.env.DATABASE_URL
const sql = postgres(conectionString)

export default sql