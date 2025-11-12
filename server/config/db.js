require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use Vercel-specific environment variables for Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment variables for debugging (without sensitive data)
console.log('Supabase configuration:', {
  supabaseUrl: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceRoleKey: !!supabaseServiceRoleKey,
});

// Create Supabase client
let supabase;
if (supabaseUrl && supabaseServiceRoleKey) {
  // Use service role key for server-side operations
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
} else if (supabaseUrl && supabaseAnonKey) {
  // Fallback to anon key
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase configuration is incomplete. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

// Custom query function that mimics the pg query interface
const query = async (text, params = []) => {
  // Extract table name from query
  const fromMatch = text.match(/FROM\s+(\w+)/i);
  const insertMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
  const updateMatch = text.match(/UPDATE\s+(\w+)/i);
  const deleteMatch = text.match(/DELETE\s+FROM\s+(\w+)/i);
  
  let tableName;
  if (fromMatch) {
    tableName = fromMatch[1];
  } else if (insertMatch) {
    tableName = insertMatch[1];
  } else if (updateMatch) {
    tableName = updateMatch[1];
  } else if (deleteMatch) {
    tableName = deleteMatch[1];
  }
  
  if (!tableName) {
    throw new Error('Could not determine table name from query');
  }
  
  // Handle different types of queries
  if (text.trim().toUpperCase().startsWith('SELECT')) {
    // Handle SELECT queries
    let queryBuilder = supabase.from(tableName).select();
    
    // Handle WHERE clauses
    if (text.includes('WHERE')) {
      // This is a simplified parser - in a real app you'd want a more robust solution
      const whereMatch = text.match(/WHERE\s+(.+)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1].split('ORDER BY')[0].trim();
        // Handle simple equality conditions
        if (whereClause.includes('=')) {
          const [column, value] = whereClause.split('=').map(s => s.trim());
          const paramIndex = params.indexOf(value.replace(/'/g, '')) + 1;
          const paramValue = params[paramIndex - 1];
          queryBuilder = queryBuilder.eq(column.replace(/"/g, ''), paramValue);
        }
      }
    }
    
    // Handle ORDER BY
    if (text.includes('ORDER BY')) {
      const orderMatch = text.match(/ORDER\s+BY\s+(.+?)(?:\s+DESC|\s+ASC|$)/i);
      if (orderMatch) {
        const orderColumn = orderMatch[1].trim();
        const isDesc = text.toUpperCase().includes('DESC');
        queryBuilder = queryBuilder.order(orderColumn.replace(/"/g, ''), { ascending: !isDesc });
      }
    }
    
    const { data, error } = await queryBuilder;
    if (error) throw error;
    return { rows: data };
  } else if (text.trim().toUpperCase().startsWith('INSERT')) {
    // Handle INSERT queries
    const valuesMatch = text.match(/VALUES\s*\((.+?)\)/i);
    if (valuesMatch) {
      const valuesString = valuesMatch[1];
      const placeholders = valuesString.split(',').map(s => s.trim());
      
      // Create object from column names and values
      const columnMatch = text.match(/INSERT\s+INTO\s+\w+\s*\((.+?)\)/i);
      if (columnMatch) {
        const columns = columnMatch[1].split(',').map(c => c.trim().replace(/"/g, ''));
        const values = {};
        
        for (let i = 0; i < columns.length; i++) {
          const paramIndex = placeholders[i].startsWith('$') ? parseInt(placeholders[i].substring(1)) - 1 : i;
          values[columns[i]] = params[paramIndex];
        }
        
        const { data, error } = await supabase.from(tableName).insert(values).select();
        if (error) throw error;
        return { rows: data };
      }
    }
  } else if (text.trim().toUpperCase().startsWith('UPDATE')) {
    // Handle UPDATE queries
    const setMatch = text.match(/SET\s+(.+?)\s+WHERE/i);
    if (setMatch) {
      const setClause = setMatch[1];
      const setParts = setClause.split(',').map(s => s.trim());
      const updates = {};
      
      for (const part of setParts) {
        const [column, value] = part.split('=').map(s => s.trim());
        if (value.startsWith('$')) {
          const paramIndex = parseInt(value.substring(1)) - 1;
          updates[column.replace(/"/g, '')] = params[paramIndex];
        } else {
          updates[column.replace(/"/g, '')] = value.replace(/'/g, '');
        }
      }
      
      // Handle WHERE clause
      const whereMatch = text.match(/WHERE\s+(.+)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1].trim();
        if (whereClause.includes('=')) {
          const [column, value] = whereClause.split('=').map(s => s.trim());
          const paramIndex = value.startsWith('$') ? parseInt(value.substring(1)) - 1 : -1;
          const paramValue = paramIndex >= 0 ? params[paramIndex] : value.replace(/'/g, '');
          
          const { data, error } = await supabase.from(tableName).update(updates).eq(column.replace(/"/g, ''), paramValue).select();
          if (error) throw error;
          return { rows: data };
        }
      }
    }
  } else if (text.trim().toUpperCase().startsWith('CREATE TABLE')) {
    // Handle CREATE TABLE queries - for Supabase, we'll just log these as they should be handled manually
    console.log('CREATE TABLE query (should be handled manually in Supabase):', text);
    return { rows: [] };
  }
  
  // For unsupported queries, return empty result
  return { rows: [] };
};

module.exports = {
  query,
};