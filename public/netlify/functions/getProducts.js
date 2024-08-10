const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    // Đảm bảo rằng đường dẫn đúng và trỏ đến tệp JSON bạn cần
    const filePath = path.resolve(__dirname, '../../products.json');
    
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
        console.error('Error reading file:', error); // Thêm log lỗi để dễ debug
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading file' }),
        };
    }
};
