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

    // Check if veterinarian user 4 exists
    const userRes = await client.query('SELECT id, email FROM users WHERE id = 4;');
    if (userRes.rows.length === 0) {
      console.log('❌ User 4 not found!');
      return;
    }
    console.log('Found user:', userRes.rows[0]);

    // Check if veterinaria 1 exists
    const vetRes = await client.query('SELECT id, nombre FROM veterinarias WHERE id = 1;');
    if (vetRes.rows.length === 0) {
      console.log('❌ Veterinaria 1 not found!');
      return;
    }
    console.log('Found veterinaria:', vetRes.rows[0]);

    // Insert profile in perfiles_veterinarios
    const checkProfile = await client.query('SELECT id FROM perfiles_veterinarios WHERE "usuarioId" = 4;');
    if (checkProfile.rows.length === 0) {
      console.log('Inserting profile for user 4...');
      await client.query(`
        INSERT INTO perfiles_veterinarios (
          especialidad, 
          matricula, 
          "aniosExperiencia", 
          "usuarioId", 
          "veterinariaPrincipalId", 
          "isActive", 
          "createdAt", 
          "updatedAt"
        ) VALUES (
          'Medicina General', 
          'MV-2026-9999', 
          5, 
          4, 
          1, 
          true, 
          NOW(), 
          NOW()
        );
      `);
      console.log('✅ Profile inserted successfully!');
    } else {
      console.log('✅ Profile already exists for user 4!');
    }

    // Now let's execute the raw report search query to verify if our query would return publication 4
    console.log('\nTesting search query for veterinariaId = 1...');
    const searchRes = await client.query(`
      SELECT p.id, p.descripcion, p."reportadoresIds"
      FROM publicaciones p
      LEFT JOIN users autor ON autor.id = p."autorId"
      LEFT JOIN perfiles_veterinarios pv_direct ON pv_direct."usuarioId" = autor.id
      LEFT JOIN veterinarias v_direct ON v_direct."adminId" = autor.id
      LEFT JOIN users creator ON creator.id = autor."createdById"
      LEFT JOIN perfiles_veterinarios pv_creator ON pv_creator."usuarioId" = creator.id
      LEFT JOIN veterinarias v_creator ON v_creator."adminId" = creator.id
      WHERE p."isActive" = true
        AND (
          pv_direct."veterinariaPrincipalId" = 1 OR 
          v_direct.id = 1 OR 
          pv_creator."veterinariaPrincipalId" = 1 OR 
          v_creator.id = 1
        );
    `);
    console.log('Query results:');
    console.table(searchRes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
