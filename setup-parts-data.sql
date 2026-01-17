-- ============================================================================
-- SAMPLE PARTS DATA SETUP
-- ============================================================================

-- Insert sample CPUs
insert into parts (category, name, brand, price, data) values
  ('cpu', 'AMD Ryzen 5 7600', 'AMD', 200.00, '{"cores": 6, "threads": 12, "base_clock": 3.8, "boost_clock": 5.1, "socket": "AM5", "tdp": 65, "cache_l3": 32}'),
  ('cpu', 'AMD Ryzen 7 7700X', 'AMD', 350.00, '{"cores": 8, "threads": 16, "base_clock": 4.2, "boost_clock": 5.4, "socket": "AM5", "tdp": 105, "cache_l3": 32}'),
  ('cpu', 'Intel Core i5-13600K', 'Intel', 280.00, '{"cores": 6, "threads": 14, "base_clock": 3.5, "boost_clock": 5.1, "socket": "LGA1700", "tdp": 125, "cache_l3": 24}'),
  ('cpu', 'Intel Core i7-13700K', 'Intel', 400.00, '{"cores": 8, "threads": 16, "base_clock": 3.4, "boost_clock": 5.4, "socket": "LGA1700", "tdp": 125, "cache_l3": 30}')
on conflict do nothing;

-- Insert sample Motherboards
insert into parts (category, name, brand, price, data) values
  ('motherboard', 'ASUS B650-PLUS', 'ASUS', 180.00, '{"socket": "AM5", "chipset": "B650", "form_factor": "ATX", "ram_slots": 4, "max_ram_speed_mhz": 6400, "max_ram_gb": 128, "m2_slots": 2, "pcie_slots": "1x PCIe 4.0 x16, 1x PCIe 3.0 x4"}'),
  ('motherboard', 'MSI B650 GAMING PLUS', 'MSI', 200.00, '{"socket": "AM5", "chipset": "B650", "form_factor": "ATX", "ram_slots": 4, "max_ram_speed_mhz": 6400, "max_ram_gb": 128, "m2_slots": 3, "pcie_slots": "1x PCIe 4.0 x16, 2x PCIe 3.0 x1"}'),
  ('motherboard', 'ASUS ROG STRIX Z790-E', 'ASUS', 450.00, '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "ATX", "ram_slots": 4, "max_ram_speed_mhz": 7600, "max_ram_gb": 192, "m2_slots": 4, "pcie_slots": "2x PCIe 5.0 x16, 1x PCIe 4.0 x4"}'),
  ('motherboard', 'MSI MAG Z790 TOMAHAWK', 'MSI', 320.00, '{"socket": "LGA1700", "chipset": "Z790", "form_factor": "ATX", "ram_slots": 4, "max_ram_speed_mhz": 7200, "max_ram_gb": 192, "m2_slots": 3, "pcie_slots": "1x PCIe 5.0 x16, 2x PCIe 3.0 x1"}')
on conflict do nothing;

-- Insert sample RAM
insert into parts (category, name, brand, price, data) values
  ('ram', 'Corsair Vengeance 32GB DDR5', 'Corsair', 120.00, '{"capacity_gb": 32, "modules": 2, "speed_mhz": 6000, "type": "DDR5", "timings": "CL36", "voltage": 1.35}'),
  ('ram', 'G.Skill Ripjaws S5 32GB DDR5', 'G.Skill', 130.00, '{"capacity_gb": 32, "modules": 2, "speed_mhz": 6000, "type": "DDR5", "timings": "CL36", "voltage": 1.35}'),
  ('ram', 'Corsair Vengeance 16GB DDR5', 'Corsair', 75.00, '{"capacity_gb": 16, "modules": 2, "speed_mhz": 5600, "type": "DDR5", "timings": "CL36", "voltage": 1.25}'),
  ('ram', 'Kingston Fury Beast 32GB DDR5', 'Kingston', 110.00, '{"capacity_gb": 32, "modules": 2, "speed_mhz": 5600, "type": "DDR5", "timings": "CL40", "voltage": 1.25}'),
  ('ram', 'Corsair Vengeance 32GB DDR4', 'Corsair', 85.00, '{"capacity_gb": 32, "modules": 2, "speed_mhz": 3200, "type": "DDR4", "timings": "CL16", "voltage": 1.35}')
on conflict do nothing;

-- Insert sample GPUs
insert into parts (category, name, brand, price, data) values
  ('gpu', 'AMD Radeon RX 7800 XT', 'AMD', 500.00, '{"vram_gb": 16, "memory_type": "GDDR6", "base_clock": 1295, "boost_clock": 2430, "cuda_cores": 3840, "power_draw": 263, "length_mm": 287}'),
  ('gpu', 'NVIDIA GeForce RTX 4070', 'NVIDIA', 600.00, '{"vram_gb": 12, "memory_type": "GDDR6X", "base_clock": 1920, "boost_clock": 2475, "cuda_cores": 5888, "power_draw": 200, "length_mm": 304}'),
  ('gpu', 'AMD Radeon RX 7700 XT', 'AMD', 400.00, '{"vram_gb": 12, "memory_type": "GDDR6", "base_clock": 2171, "boost_clock": 2544, "cuda_cores": 3456, "power_draw": 245, "length_mm": 264}'),
  ('gpu', 'NVIDIA GeForce RTX 4060 Ti', 'NVIDIA', 400.00, '{"vram_gb": 8, "memory_type": "GDDR6", "base_clock": 2310, "boost_clock": 2535, "cuda_cores": 4352, "power_draw": 160, "length_mm": 280}')
on conflict do nothing;

-- Insert sample Storage
insert into parts (category, name, brand, price, data) values
  ('storage', 'Samsung 980 Pro 1TB NVMe', 'Samsung', 90.00, '{"capacity_gb": 1000, "type": "NVMe SSD", "interface": "PCIe 4.0", "read_speed_mb": 7000, "write_speed_mb": 5000, "form_factor": "M.2"}'),
  ('storage', 'WD Black SN850X 1TB NVMe', 'Western Digital', 100.00, '{"capacity_gb": 1000, "type": "NVMe SSD", "interface": "PCIe 4.0", "read_speed_mb": 7300, "write_speed_mb": 6600, "form_factor": "M.2"}'),
  ('storage', 'Samsung 980 Pro 2TB NVMe', 'Samsung', 180.00, '{"capacity_gb": 2000, "type": "NVMe SSD", "interface": "PCIe 4.0", "read_speed_mb": 7000, "write_speed_mb": 5000, "form_factor": "M.2"}'),
  ('storage', 'Crucial MX500 1TB SATA', 'Crucial', 60.00, '{"capacity_gb": 1000, "type": "SATA SSD", "interface": "SATA III", "read_speed_mb": 560, "write_speed_mb": 510, "form_factor": "2.5 inch"}'),
  ('storage', 'Seagate Barracuda 2TB HDD', 'Seagate', 50.00, '{"capacity_gb": 2000, "type": "HDD", "interface": "SATA III", "read_speed_mb": 210, "write_speed_mb": 210, "form_factor": "3.5 inch"}')
on conflict do nothing;

-- Insert sample PSUs
insert into parts (category, name, brand, price, data) values
  ('psu', 'Corsair RM750x', 'Corsair', 110.00, '{"wattage": 750, "efficiency_rating": "80+ Gold", "modular": true, "form_factor": "ATX", "warranty_years": 10}'),
  ('psu', 'Seasonic Focus GX-750', 'Seasonic', 120.00, '{"wattage": 750, "efficiency_rating": "80+ Gold", "modular": true, "form_factor": "ATX", "warranty_years": 10}'),
  ('psu', 'Corsair RM850x', 'Corsair', 140.00, '{"wattage": 850, "efficiency_rating": "80+ Gold", "modular": true, "form_factor": "ATX", "warranty_years": 10}'),
  ('psu', 'EVGA SuperNOVA 750 G5', 'EVGA', 100.00, '{"wattage": 750, "efficiency_rating": "80+ Gold", "modular": true, "form_factor": "ATX", "warranty_years": 7}')
on conflict do nothing;

-- Insert sample Cases
insert into parts (category, name, brand, price, data) values
  ('case', 'Fractal Design Meshify C', 'Fractal Design', 100.00, '{"form_factor": "Mid Tower", "material": "Steel/Plastic", "included_fans": 2, "fan_sizes": "120mm/140mm", "max_gpu_length_mm": 315, "max_cooler_height_mm": 170}'),
  ('case', 'NZXT H510', 'NZXT', 80.00, '{"form_factor": "Mid Tower", "material": "Steel", "included_fans": 2, "fan_sizes": "120mm/140mm", "max_gpu_length_mm": 381, "max_cooler_height_mm": 165}'),
  ('case', 'Lian Li Lancool 216', 'Lian Li', 120.00, '{"form_factor": "Mid Tower", "material": "Steel/Aluminum", "included_fans": 3, "fan_sizes": "120mm/140mm", "max_gpu_length_mm": 392, "max_cooler_height_mm": 180}'),
  ('case', 'Corsair 4000D Airflow', 'Corsair', 95.00, '{"form_factor": "Mid Tower", "material": "Steel", "included_fans": 2, "fan_sizes": "120mm/140mm", "max_gpu_length_mm": 360, "max_cooler_height_mm": 170}')
on conflict do nothing;

-- Insert sample Coolers
insert into parts (category, name, brand, price, data) values
  ('cooler', 'Noctua NH-D15', 'Noctua', 100.00, '{"type": "Air", "height_mm": 165, "fan_sizes": "2x 140mm", "socket_compatibility": ["AM5", "LGA1700"], "noise_level_db": 24.6}'),
  ('cooler', 'be quiet! Dark Rock Pro 4', 'be quiet!', 90.00, '{"type": "Air", "height_mm": 163, "fan_sizes": "2x 135mm", "socket_compatibility": ["AM5", "LGA1700"], "noise_level_db": 24.3}'),
  ('cooler', 'Corsair H150i Elite', 'Corsair', 170.00, '{"type": "Liquid", "radiator_size": "360mm", "fan_sizes": "3x 120mm", "socket_compatibility": ["AM5", "LGA1700"], "noise_level_db": 30}'),
  ('cooler', 'Arctic Liquid Freezer II 240', 'Arctic', 100.00, '{"type": "Liquid", "radiator_size": "240mm", "fan_sizes": "2x 120mm", "socket_compatibility": ["AM5", "LGA1700"], "noise_level_db": 28}')
on conflict do nothing;
