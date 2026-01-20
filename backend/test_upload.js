const fs = require('fs');
const path = require('path');

async function testUpload() {
    // Create a dummy file to upload
    const testFilePath = path.join(__dirname, 'test_submission.txt');
    fs.writeFileSync(testFilePath, 'This is a test analysis file.');

    const formData = new FormData();
    formData.append('participantName', 'Test User');
    formData.append('description', 'Test Description');

    // Read the file as a Blob (Node 18+ supports fetch and FormData)
    const fileContent = fs.readFileSync(testFilePath);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    formData.append('file', blob, 'test_submission.txt');

    try {
        console.log('Uploading file...');
        const response = await fetch('http://localhost:5000/api/analysis/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Upload Result:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('SUCCESS: File uploaded.');
        } else {
            console.error('FAILURE: Upload failed.');
        }
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    }
}

testUpload();
