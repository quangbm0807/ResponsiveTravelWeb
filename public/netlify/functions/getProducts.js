const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
    const filePath = path.resolve(__dirname, '../../abc.json');

    try {
        const data = await fs.readFile(filePath, 'utf8');
        return {
            statusCode: 200,
            body: data, // Phản hồi là JSON hợp lệ
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Error reading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};
