const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const supaUrl = "https://xkmvfbelkmvpzuqyheuy.supabase.co";
const supaAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbXZmYmVsa212cHp1cXloZXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NjQ4MTUsImV4cCI6MjAyNDA0MDgxNX0.LJeENecBfIx99ydu_Kwq09BPHeG5WnXAuQIYcJBcNKs";

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get("/api/seasons", async (req, res) => {
  const {data, error} = await supabase.from("seasons").select();
  res.send(data);
});

// -------- CIRCUITS --------

app.get("/api/circuits", async (req, res) => {
  const {data, error} = await supabase.from("circuits").select();
  res.send(data);
});

app.get("/api/circuits/:ref", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("circuits")
      .select(`circuitRef, name, location, country, lat, lng`)
      .eq("circuitRef", req.params.ref);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Not Found', details: 'Circuit not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// -------- CONSTRUCTORS --------

app.get("/api/constructors", async (req, res) => {
  const {data, error} = await supabase.from("constructors").select();
  res.send(data);
});

app.get("/api/constructors/:ref", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("constructors")
      .select(`constructorRef, name, nationality`)
      .eq("constructorRef", req.params.ref);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Not Found', details: 'Constructor not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// -------- DRIVERS --------

app.get("/api/drivers", async (req, res) => {
  const {data, error} = await supabase.from("drivers").select();
  res.send(data);
});

app.get("/api/drivers/:ref", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .select(`driverRef, number, code, forename, surname, nationality`)
      .eq("driverRef", req.params.ref);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Not Found', details: 'Driver not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// -------- RACES --------

app.get("/api/races/:raceId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("races")
      .select(`raceId, year, name, date, time`)
      .eq("raceId", req.params.raceId);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Not Found', details: 'Race not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// -------- RESULTS --------

// !! Doesnt work because of foreign key issues
app.get("/api/results/:raceId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("results")
      .select(`driver (driverRef, code, forename, surname), race (name, round, year, date), constructor (name, constructorRef, nationality)`)
      .eq("raceId", req.params.raceId)
      .order("grid", { ascending: true })

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Not Found', details: 'Result not found' });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
