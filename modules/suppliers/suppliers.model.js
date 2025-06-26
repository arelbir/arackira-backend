// modules/suppliers/suppliers.model.js
const pool = require('../../db');

class Supplier {
  constructor({
    id,
    name,
    tax_number,
    contact_person,
    phone,
    email,
    address,
    is_active,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.name = name;
    this.tax_number = tax_number;
    this.contact_person = contact_person;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

// Tüm tedarikçileri listele
async function getAllSuppliers(filters = {}) {
  const { sortBy = 'name', sortOrder = 'ASC', isActive, page = 1, pageSize = 20 } = filters;
  
  const offset = (page - 1) * pageSize;
  let query = `
    SELECT id, name, tax_number, contact_person, phone, email, address, is_active, created_at, updated_at
    FROM suppliers
    WHERE 1=1
  `;
  
  const queryParams = [];
  
  // Aktiflik filtresini ekle
  if (isActive !== undefined) {
    query += ` AND is_active = $${queryParams.length + 1}`;
    queryParams.push(isActive === 'true' || isActive === true);
  }
  
  // Toplam kayıt sayısı
  const countQuery = `SELECT COUNT(*) FROM (${query}) AS count_query`;
  const countResult = await pool.query(countQuery, queryParams);
  const totalCount = parseInt(countResult.rows[0].count);
  
  // Ana sorgu - sıralama ve sayfalama
  query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(parseInt(pageSize), parseInt(offset));
  
  const result = await pool.query(query, queryParams);
  
  return {
    data: result.rows.map(row => new Supplier(row)),
    meta: {
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  };
}

// Belirli bir tedarikçiyi id ile getir
async function getSupplierById(id) {
  const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Supplier(result.rows[0]);
}

// Tedarikçi arama
async function searchSuppliers(searchTerm, limit = 10) {
  if (!searchTerm || searchTerm.length < 2) {
    throw new Error('Arama terimi en az 2 karakter olmalıdır');
  }
  
  const query = `
    SELECT id, name, tax_number
    FROM suppliers
    WHERE 
      (name ILIKE $1 OR tax_number ILIKE $1)
      AND is_active = TRUE
    ORDER BY name ASC
    LIMIT $2
  `;
  
  const result = await pool.query(query, [`%${searchTerm}%`, parseInt(limit)]);
  return result.rows.map(row => new Supplier(row));
}

// Yeni tedarikçi ekle
async function createSupplier(data) {
  // Zorunlu alan kontrolü
  if (!data.name || data.name.trim() === '') {
    throw new Error('Tedarikçi adı zorunludur');
  }
  
  // Vergi numarası tekil olmalı (varsa)
  if (data.tax_number) {
    const existingCheck = await pool.query(
      'SELECT id FROM suppliers WHERE tax_number = $1',
      [data.tax_number]
    );
    
    if (existingCheck.rows.length > 0) {
      throw new Error('Bu vergi numarası ile kayıtlı başka bir tedarikçi bulunmaktadır');
    }
  }
  
  const query = `
    INSERT INTO suppliers (name, tax_number, contact_person, phone, email, address, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, tax_number, contact_person, phone, email, address, is_active, created_at, updated_at
  `;
  
  const values = [
    data.name,
    data.tax_number || null,
    data.contact_person || null,
    data.phone || null,
    data.email || null,
    data.address || null,
    data.is_active === undefined ? true : data.is_active
  ];
  
  const result = await pool.query(query, values);
  return new Supplier(result.rows[0]);
}

// Tedarikçi güncelle
async function updateSupplier(id, data) {
  // Zorunlu alan kontrolü
  if (data.name !== undefined && (data.name === null || data.name.trim() === '')) {
    throw new Error('Tedarikçi adı zorunludur');
  }
  
  // Tedarikçinin varlığını kontrol et
  const checkQuery = 'SELECT id FROM suppliers WHERE id = $1';
  const checkResult = await pool.query(checkQuery, [id]);
  
  if (checkResult.rows.length === 0) {
    throw new Error('Güncellenecek tedarikçi bulunamadı');
  }
  
  // Vergi numarası tekil olmalı (değiştiyse)
  if (data.tax_number) {
    const existingCheck = await pool.query(
      'SELECT id FROM suppliers WHERE tax_number = $1 AND id != $2',
      [data.tax_number, id]
    );
    
    if (existingCheck.rows.length > 0) {
      throw new Error('Bu vergi numarası ile kayıtlı başka bir tedarikçi bulunmaktadır');
    }
  }
  
  // Güncellenecek alanları dinamik olarak oluştur
  const fields = [];
  const values = [];
  const updates = { 
    name: data.name,
    tax_number: data.tax_number,
    contact_person: data.contact_person,
    phone: data.phone,
    email: data.email,
    address: data.address,
    is_active: data.is_active
  };
  
  Object.keys(updates).forEach((field, index) => {
    if (updates[field] !== undefined) {
      values.push(updates[field]);
      fields.push(`${field} = $${values.length}`);
    }
  });
  
  // updated_at alanını da güncelle
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  
  // Güncellenecek alan yoksa hata döndür
  if (fields.length === 1) { // Sadece updated_at varsa
    throw new Error('Güncellenecek alan bulunamadı');
  }
  
  // Güncelleme sorgusu
  values.push(id);
  const query = `
    UPDATE suppliers
    SET ${fields.join(', ')}
    WHERE id = $${values.length}
    RETURNING id, name, tax_number, contact_person, phone, email, address, is_active, created_at, updated_at
  `;
  
  const result = await pool.query(query, values);
  
  if (result.rows.length === 0) return null;
  return new Supplier(result.rows[0]);
}

// Tedarikçi sil
async function deleteSupplier(id) {
  // Tedarikçinin varlığını kontrol et
  const checkQuery = 'SELECT id FROM suppliers WHERE id = $1';
  const checkResult = await pool.query(checkQuery, [id]);
  
  if (checkResult.rows.length === 0) {
    throw new Error('Silinecek tedarikçi bulunamadı');
  }
  
  // Bu tedarikçi ile ilişkili araç var mı kontrol et
  const relationCheck = await pool.query(
    'SELECT COUNT(*) FROM vehicles WHERE supplier_id = $1',
    [id]
  );
  
  if (parseInt(relationCheck.rows[0].count) > 0) {
    // İlişki varsa, fiziksel silme yerine is_active = false yap
    const deactivateQuery = `
      UPDATE suppliers
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name
    `;
    
    const result = await pool.query(deactivateQuery, [id]);
    return {
      deactivated: true,
      supplier: new Supplier(result.rows[0])
    };
  }
  
  // İlişki yoksa fiziksel olarak sil
  const deleteQuery = 'DELETE FROM suppliers WHERE id = $1 RETURNING id, name, tax_number, contact_person, phone, email, address, is_active, created_at, updated_at';
  const result = await pool.query(deleteQuery, [id]);
  
  if (result.rows.length === 0) return null;
  return {
    deactivated: false,
    supplier: new Supplier(result.rows[0])
  };
}

module.exports = {
  Supplier,
  getAllSuppliers,
  getSupplierById,
  searchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
