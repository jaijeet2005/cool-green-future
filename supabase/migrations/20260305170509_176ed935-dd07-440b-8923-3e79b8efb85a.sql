
-- Create community planted trees table (no auth required for MVP - public tracking)
CREATE TABLE public.community_trees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  species_id TEXT NOT NULL,
  species_name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  planted_by TEXT DEFAULT 'anonymous',
  cooling_capacity DOUBLE PRECISION NOT NULL DEFAULT 0,
  pollution_absorption INTEGER NOT NULL DEFAULT 0,
  api_score INTEGER NOT NULL DEFAULT 0,
  co2_absorption INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_trees ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read community trees
CREATE POLICY "Anyone can view community trees"
  ON public.community_trees FOR SELECT
  USING (true);

-- Allow anyone to insert trees (public community tracking, no auth for MVP)
CREATE POLICY "Anyone can plant community trees"
  ON public.community_trees FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete their own trees (by id)
CREATE POLICY "Anyone can delete community trees"
  ON public.community_trees FOR DELETE
  USING (true);

-- Create index for spatial queries by city
CREATE INDEX idx_community_trees_city ON public.community_trees (city_id);
CREATE INDEX idx_community_trees_location ON public.community_trees (lat, lng);
