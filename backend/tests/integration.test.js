const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth & Goal API Integration', () => {
    let token;

    afterAll(async () => {
        // We do not drop the db entirely because we intend to keep the seeded data,
        // just close the connection.
        await mongoose.connection.close();
    });

    describe('POST /api/auth/login', () => {
        it('should authenticate manager and return a token', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'manager@company.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.role).toBe('Manager');
            token = res.body.token; // Save token for next tests
        });

        it('should fail with incorrect credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'manager@company.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/goals/my-goals', () => {
        it('should fetch goals successfully for authorized user', async () => {
            const res = await request(app)
                .get('/api/goals/my-goals')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });

        it('should fail if no token is provided', async () => {
            const res = await request(app)
                .get('/api/goals/my-goals');
            expect(res.statusCode).toEqual(401);
        });
    });
});
