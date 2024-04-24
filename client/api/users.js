import { sql } from '@vercel/postgres';

// Fetch all users
export async function getAllUsers() {
    const query = sql`
        SELECT * FROM users;
    `;
    const result = await db.query(query);
    return result.rows;
}

// Fetch a specific user by ID
export async function getUserById(userId) {
    const query = sql`
        SELECT * FROM users WHERE id = ${userId};
    `;
    const result = await db.query(query);
    return result.rows[0];
}

// Fetch a specific user by email
export async function getUserByEmail(userEmail) {
    const query = sql`
        SELECT * FROM users WHERE email = ${userEmail};
    `;
    const result = await db.query(query);
    return result.rows[0];
}

// Edit a user
export async function editUser(userId, newData) {
    const query = sql`
        UPDATE users SET
        name = ${newData.name},
        email = ${newData.email},
        age = ${newData.age}
        WHERE id = ${userId};
    `;
    await db.query(query);
}

// Delete a user
export async function deleteUser(userId) {
    const query = sql`
        DELETE FROM users WHERE id = ${userId};
    `;
    await db.query(query);
}
