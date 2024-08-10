// public/netlify/functions/getProducts.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Đường dẫn đến file JSON trong thư mục public
    const filePath = path.resolve(__dirname, '../products.json');
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return {
            statusCode: 200,
            body: data,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
        };
    }
};
