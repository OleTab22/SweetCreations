/**
 * Validates email format
 * Allows: 
 * - Local part can contain letters, numbers, and common special characters
 * - Domain part must be valid with at least one dot
 * - No whitespace allowed
 * - TLD must be at least 2 characters
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
exports.validateEmail = (email) => {
    // More comprehensive email regex that follows RFC 5322 standards
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!email || typeof email !== 'string') return false;
    
    // Check basic regex pattern
    if (!emailRegex.test(email)) return false;
    
    // Additional checks
    const [localPart, domain] = email.split('@');
    
    // Local part should not exceed 64 characters
    if (localPart.length > 64) return false;
    
    // Total email length should not exceed 254 characters
    if (email.length > 254) return false;
    
    // Domain should have at least one dot and valid TLD
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    if (domainParts[domainParts.length - 1].length < 2) return false;
    
    return true;
};

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character from: !@#$%^&*()_+-=[]{}|;:,.<>?
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with status and detailed feedback
 */
exports.validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }

    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    };

    const failed = Object.entries(checks)
        .filter(([, passes]) => !passes)
        .map(([check]) => check);

    if (failed.length === 0) {
        return {
            isValid: true,
            message: 'Password meets all requirements'
        };
    }

    const messages = {
        length: 'be at least 8 characters long',
        uppercase: 'contain at least one uppercase letter',
        lowercase: 'contain at least one lowercase letter',
        number: 'contain at least one number',
        special: 'contain at least one special character'
    };

    return {
        isValid: false,
        message: `Password must ${failed.map(f => messages[f]).join(', ')}`,
        failed
    };
};

function validateProductFields(product) {
    const errors = [];
    if (!product.name || product.name.trim() === '') errors.push('Product name is required');
    if (product.price == null || product.price < 0) errors.push('Valid price is required');
    if (product.stock == null || product.stock < 0) errors.push('Valid stock is required');
    return { isValid: errors.length === 0, errors };
}

function validateOrderData(order) {
    const errors = [];
    if (!Array.isArray(order.products) || order.products.length === 0) errors.push('Order must contain products');
    if (order.total == null || order.total < 0) errors.push('Valid total is required');
    return { isValid: errors.length === 0, errors };
}

module.exports = { validateEmail: exports.validateEmail, validatePassword: exports.validatePassword, validateProductFields, validateOrderData };

/**
 * Example usage:
 * 
 * const emailResult = validateEmail('user@example.com');
 * console.log(emailResult); // true or false
 * 
 * const passwordResult = validatePassword('MyP@ssw0rd');
 * console.log(passwordResult);
 * // {
 * //   isValid: true,
 * //   message: 'Password meets all requirements'
 * // }
 * 
 * const weakPasswordResult = validatePassword('password');
 * console.log(weakPasswordResult);
 * // {
 * //   isValid: false,
 * //   message: 'Password must contain at least one uppercase letter, contain at least one special character',
 * //   failed: ['uppercase', 'special']
 * // }
 */