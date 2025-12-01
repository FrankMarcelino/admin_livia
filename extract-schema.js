// Script para extrair schema atualizado do Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://wfrxwfbslhkkzkexyilx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmcnh3ZmJzbGhra3prZXh5aWx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTcwOSwiZXhwIjoyMDc4NzkxNzA5fQ.aecEqxioevtkt1PO_Z79ZuHt0UuazoHTYiMcPD6UUV0';

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'synapses',
  'contacts',
  'conversation_reactivations_settings',
  'neurocores',
  'message_feedback',
  'channel_providers',
  'base_conhecimentos',
  'niches',
  'conversation_reasons_pauses_and_closures',
  'conversation_tags',
  'quick_reply_templates',
  'feature_modules',
  'feedbacks',
  'messages',
  'agents',
  'tenants',
  'tags',
  'users',
  'channels',
  'contact_data_changes',
  'conversations'
];

async function extractSchema() {
  const schema = {
    exported_at: new Date().toISOString(),
    database_url: supabaseUrl,
    total_tables: tables.length,
    tables: {}
  };

  console.log('🔍 Extraindo schema do Supabase...\n');

  for (const tableName of tables) {
    try {
      console.log(`📋 Processando: ${tableName}`);

      // Buscar primeiro registro para analisar estrutura
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(`  ⚠️  Erro: ${error.message}`);
        schema.tables[tableName] = {
          row_count: 0,
          columns: {
            '_empty': {
              note: `Erro ao acessar: ${error.message}`
            }
          },
          column_count: 1
        };
        continue;
      }

      const rowCount = count || 0;
      console.log(`  ✅ ${rowCount} registros`);

      if (!data || data.length === 0) {
        schema.tables[tableName] = {
          row_count: rowCount,
          columns: {
            '_empty': {
              note: 'Tabela vazia, estrutura não disponível'
            }
          },
          column_count: 1
        };
        continue;
      }

      // Analisar colunas do primeiro registro
      const columns = {};
      const sampleRow = data[0];

      for (const [key, value] of Object.entries(sampleRow)) {
        columns[key] = {
          type: value === null ? 'object' : typeof value,
          nullable: value === null,
          sample_value: value
        };
      }

      schema.tables[tableName] = {
        row_count: rowCount,
        columns,
        column_count: Object.keys(columns).length
      };

      console.log(`  📊 ${Object.keys(columns).length} colunas\n`);

    } catch (err) {
      console.log(`  ❌ Exceção: ${err.message}\n`);
      schema.tables[tableName] = {
        row_count: 0,
        columns: {
          '_empty': {
            note: `Exceção: ${err.message}`
          }
        },
        column_count: 1
      };
    }
  }

  // Salvar JSON
  const jsonPath = 'database-schema-updated.json';
  fs.writeFileSync(jsonPath, JSON.stringify(schema, null, 2));
  console.log(`\n✅ Schema extraído com sucesso!`);
  console.log(`📁 Salvo em: ${jsonPath}`);

  return schema;
}

extractSchema().catch(console.error);
