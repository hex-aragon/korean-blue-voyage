# Dynamic sea, traffic and weather references — v1.11

Reviewed 2026-09-12. The game uses fictional traffic and accelerated, procedural weather, not AIS, a forecast, a certified radar or a ship handling trainer.

- [NOAA / NWS Beaufort scale](https://www.weather.gov/pqr/beaufort): increasing wind is associated with more breaking crests, blown foam, spray and reduced visibility. Used to guide the qualitative progression from breeze to squall and severe storm. The game does not equate its wave amplitude multiplier with measured significant wave height. Its preset wind speeds, gust frequencies, transition times and wave groups are game tuning.
- [IMO collision prevention overview](https://www.imo.org/en/ourwork/safety/pages/preventing-collisions.aspx): safe speed, proper lookout, radar use and early assessment of collision risk. Used for the long-range display, motion vectors, track history and early approach warning. Automatic courtesy stops are anti-overlap game behavior, not a complete implementation of COLREGs.
- [Wärtsilä bow slamming](https://www.wartsila.com/encyclopedia/term/bow-slamming): retained as a reference for hull reentry spray. See [hydrodynamics references](HYDRODYNAMICS_REFERENCES.md).

## Implementation and limits

- Up to 22 moving vessels plus two working vessels and two whales per sea region, subject to safe route availability. Seeded positions, directions and speeds vary by voyage. Safe loops cover the port approaches and outer waters; vessels do not teleport into the player's immediate path. River traffic remains unchanged.
- Cargo contacts include container ships, bulkers, tankers and car carriers; ferries, tugs and fishing vessels use their own silhouettes. Outer cargo ships use larger scale than harbor service vessels.
- Routes are checked against piers, island obstacles, working gear and loaded terrain. Terrain is lowered underneath the fictional navigation area so large troughs do not expose a flat false seabed. Background land remains geographic context, not surveyed navigational bathymetry.
- Radar ranges: 400 / 800 / 1600 / 3200 / 6400 game metres. Actual simulated positions appear with up to 120 simulation seconds of history and a 60-second motion vector (clipped visually). Contact selection shows CPA/TCPA under constant-velocity assumptions. No sea clutter or missed detection simulation. Whales, fishing nets and floating wood are explicit learning overlays, not guaranteed real radar echoes.
- Automatic weather changes after 45 seconds initially, then at seeded 55–110 second intervals. Breeze / rough / squall transitions are smoothed over several seconds. Typhoon is an opt-in severe-weather preset; it has no modeled eye, regional storm track, surge or breaking-wave fluid solver.
- Shared CPU/GLSL sea spectrum adds a 12-second long swell; derivatives used for hull contact match the rendered field. A slow wave-group envelope increases crests during storms. Rain, cloud cover, haze, wind direction, leeway, wind-induced heel, NPC attitude and existing wind/water audio respond together.
- Particle budgets remain bounded; rain is one GPU line buffer, with 600 streaks on a mobile initial viewport or 1400 on desktop. Pausing freezes weather and effects. Translation time warp does not accelerate weather.

## v1.12 visibility correction

Fixed-route traffic alone left remote voyage positions empty. A second bounded population now establishes safe local circuits near the current vessel and replaces contacts beyond 1.1 km, subject to land/gear clearance. Ten local sea contacts include pilot launches and stylized sharks/whales; river encounters are five service boats. Wildlife placement is fictional, not a habitat/distribution model. Animals are observation overlays, not AIS or radar measurements. The model retains a minimum 160 m spawn clearance.

The sky previously occupied a fixed box around the origin and the lighting kept bright-water / hemisphere settings under storms. The sky follows the camera; all headings and remote voyage positions use the same weather palette and global lighting. Rain is rendered in a camera-local volume for efficiency while weather state and water waves apply across the scene.
