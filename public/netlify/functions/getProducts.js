const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const filePath = path.resolve(__dirname, '../../products.json'); // Đảm bảo đường dẫn đúng
    
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
        console.error('Error reading file:', error); // Ghi lỗi vào log để kiểm tra
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
        };
    }
};
