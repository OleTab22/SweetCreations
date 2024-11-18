document.getElementById('imageUrl').addEventListener('input', function () {
    const previewImage = document.getElementById('image-preview');
    previewImage.src = this.value || 'placeholder.jpg'; // Default placeholder if image URL is empty
});

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();

    // Basic validation
    if (!name || price <= 0 || !description || !category || !imageUrl) {
        alert('Please fill all fields correctly');
        return;
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, price, description, category, imageUrl })
        });

        const responseText = await response.text();
        console.log('Response Text:', responseText); // Log the response text

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        const data = JSON.parse(responseText);
        console.log('Product added successfully:', data);

        alert('Product added successfully!');
        document.getElementById('addProductForm').reset();
        document.getElementById('image-preview').src = 'placeholder.jpg';
    } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
    }
});

async function addProduct(productData) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const responseText = await response.text();
        console.log('Response Text:', responseText); // Log the response text

        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Product added successfully:', data);
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification(`Failed to add product: ${error.message}`, 'error');
    }
}