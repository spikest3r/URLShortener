import { neon } from '@netlify/neon';
const sql = neon();

// generator for tiny link. 
function randomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

exports.handler = async (event) => {
    const ogLink = event.queryStringParameters.link;
    try {
        let tiny;
        let maxTries = 10;
        let found = false;
        // check if generated tiny link is unique, give up on 10 attempts
        for(let i = 0; i < maxTries; i++) {
            tiny = randomString();
            const existing = await sql`SELECT 1 FROM urls WHERE short_url = ${tiny}`;
            if(existing.length === 0) {
                found = true;
                break;
            }
        }
        if (!ogLink.startsWith('http://') && !ogLink.startsWith('https://')) {
            ogLink = 'https://' + ogLink;
        }
        
        if(found) {
            await sql`INSERT INTO urls(original_url, short_url) VALUES (${ogLink}, ${tiny})` // insert link into db (store only id)
            return {
                statusCode: 200,
                body: JSON.stringify(tiny), // stringify the result
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        } else {
            throw new Error("Couldn't generate tiny link"); // throw error so try/catch can return error to client
        }
    } catch (error) {
        console.error('DB error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'DB query failed' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
