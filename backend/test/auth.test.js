const { validateEmail, validatePassword } = require('../utils/validation');

test('validates correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
});

test('validates password strength', () => {
    expect(validatePassword('StrongPass123!').isValid).toBe(true);
    expect(validatePassword('weak').isValid).toBe(false);
});
