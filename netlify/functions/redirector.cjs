import { neon } from '@netlify/neon';
const sql = neon();

exports.handler = async (event) => {
    const path = event.path.replace("/.netlify/functions/redirector/", "")
    console.log(path)
    const query = await sql`SELECT original_url FROM urls WHERE short_url = ${path}`;
    const ogLink = query[0]?.original_url;

    if(ogLink) {
        return {
            statusCode: 302,
            headers: {
                Location: ogLink
            }
        }
    } else {
        return {
            statusCode: 404,
            body: '<h1>=( Not found </h1>'
        }
    }
}