-- Migration: Create agent_templates table
-- Created: 2025-12-03
-- Purpose: Store AI agent templates for reuse across neurocores

-- Create agent_function enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE agent_function AS ENUM ('attendant', 'intention', 'in_guard_rails', 'observer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create agent_templates table
CREATE TABLE IF NOT EXISTS agent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Technical Structure (same pattern as 'agents' table)
  name TEXT NOT NULL,
  type agent_function NOT NULL,  -- Enum: attendant, intention, in_guard_rails, observer
  reactive BOOLEAN NOT NULL DEFAULT true,

  -- Persona Information
  persona_name TEXT,
  age TEXT,
  gender TEXT,
  objective TEXT,
  communication TEXT,
  personality TEXT,

  -- Complex Configurations (JSONB)
  limitations JSONB,              -- Array of strings: ["Don't do X", "Don't do Y"]
  rules JSONB,                    -- General rules (flexible structure)
  instructions JSONB,             -- Array of strings: ["Do X", "Do Y"]
  guide_line JSONB,               -- Guideline in steps (array of objects)
  others_instructions JSONB,      -- Other instructions

  -- Status and Metadata
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_templates_type ON agent_templates(type);
CREATE INDEX IF NOT EXISTS idx_agent_templates_active ON agent_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_agent_templates_name ON agent_templates(name);
CREATE INDEX IF NOT EXISTS idx_agent_templates_created_by ON agent_templates(created_by);

-- Enable Row Level Security
ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Super Admin can do everything
CREATE POLICY "Super Admin can do everything on agent_templates"
  ON agent_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_agent_templates
  BEFORE UPDATE ON agent_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE agent_templates IS 'AI agent templates for reuse across neurocores. Created by Super Admin.';

-- Add comments to important columns
COMMENT ON COLUMN agent_templates.type IS 'Agent function type (attendant, intention, in_guard_rails, observer)';
COMMENT ON COLUMN agent_templates.reactive IS 'If true, agent is reactive (responds when triggered). If false, proactive.';
COMMENT ON COLUMN agent_templates.limitations IS 'JSONB array of strings defining what agent should NOT do';
COMMENT ON COLUMN agent_templates.instructions IS 'JSONB array of strings defining what agent SHOULD do';
COMMENT ON COLUMN agent_templates.guide_line IS 'JSONB array of objects with guideline steps: [{title: string, steps: string[]}]';
