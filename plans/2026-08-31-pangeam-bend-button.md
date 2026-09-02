# Implementation Plan: Pangeam Elastic Bend Button (Sasha Martynchuk Replica)

Date: 2026-08-31
Reference: https://www.sashamartynchuk.com/ & user recording video

## Overview
Replicate the kinetic text-bend interactive button from Sasha Martynchuk's portfolio. Each character in the uppercase word ("PANGEAM") dynamically responds to pointer position with a damped Gaussian spring wave (vertical displacement, curve tilt rotation, and scaling).

## Physics & Interaction Architecture
- Characters split into individual `inline-block` spans.
- Distance-based Gaussian curve: `f = (char.cx - mouse.x) / (1.75 * fontSize)`, `influence = exp(-f^2 * 2.2) * active`.
- Spring displacement with damping (`0.8`) and per-char stiffness variance (`0.135`).
- Tangent wave slope angle: `rotate = clamp(-8deg, 8deg, slope * 26)`.
- Vertical stretch: `scale = 1 + min(1, |y| / (0.5 * fontSize)) * 0.035`.
- Continuous RAF loop that goes to sleep once velocity settles below threshold.
