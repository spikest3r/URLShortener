import { neon } from '@netlify/neon';
const sql = neon();

exports.handler = async (event) => {
    const path = event.path.replace("/.netlify/functions/redirector/", "").replace("/","")
    console.log(path)
    const query = await sql`SELECT original_url FROM urls WHERE short_url = ${path}`;
    const ogLink = query[0]?.original_url;

    if(ogLink && ogLink !== "@react-refresh") {
        return {
            statusCode: 302,
            headers: {
                Location: ogLink
            }
        }
    } else {
        return {
            statusCode: 302,
            headers: {
                Location: "/"
            }
        }
    }
}