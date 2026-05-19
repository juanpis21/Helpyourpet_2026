const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: '123456',
    database: 'clinic_pet',
  });

  try {
    await client.connect();
    console.log('Connected to DB successfully!');

    // 1. Check if column reportadoresIds exists in Table publicaciones
    const columnCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'publicaciones' AND column_name = 'reportadoresIds';
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('❌ COLUMN "reportadoresIds" DOES NOT EXIST in table "publicaciones"!');
    } else {
      console.log('✅ COLUMN "reportadoresIds" exists! Data type:', columnCheck.rows[0].data_type);
    }

    // 2. Select all publications and show their reportadoresIds
    const pubs = await client.query(`
      SELECT id, descripcion, "autorId", "isActive", "reportadoresIds"
      FROM publicaciones;
    `);
    console.log('\n--- Publications List ---');
    console.table(pubs.rows);

    // 3. Select all veterinarias and their adminIds
    const vets = await client.query(`
      SELECT id, nombre, "adminId"
      FROM veterinarias;
    `);
    console.log('\n--- Veterinarias List ---');
    console.table(vets.rows);

    // 4. Select all users with their roles
    const users = await client.query(`
      SELECT u.id, u.email, u."fullName", u."roleId", r.name as role_name, u."createdById"
      FROM users u
      LEFT JOIN roles r ON r.id = u."roleId";
    `);
    console.log('\n--- Users List ---');
    console.table(users.rows);

    // 5. Select all perfiles_veterinarios
    const profiles = await client.query(`
      SELECT id, "usuarioId", "veterinariaPrincipalId"
      FROM perfiles_veterinarios;
    `);
    console.log('\n--- Perfiles Veterinarios List ---');
    console.table(profiles.rows);

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
