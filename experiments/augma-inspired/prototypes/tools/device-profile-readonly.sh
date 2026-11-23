#!/usr/bin/env bash
# Read-only local device profile for the YANDIK+ lab. Not an installation or benchmark.
set -euo pipefail
printf '%s\n' 'YANDIK+ LAB / PERANGKAT UJI / READ ONLY'
printf 'UTC: '; date -u '+%Y-%m-%dT%H:%M:%SZ'
printf 'KERNEL: '; uname -sr
printf 'ARSITEKTUR: '; uname -m
printf 'HOST: '; hostname
if [ -r /proc/device-tree/model ]; then
  printf 'BOARD: '; tr -d '\000' < /proc/device-tree/model; printf '\n'
fi
printf '\nMEMORI\n'
if command -v free >/dev/null 2>&1; then free -m; else grep -E '^(MemTotal|MemAvailable|SwapTotal):' /proc/meminfo || true; fi
printf '\nDISK\n'
df -h .
printf '\nCPU\n'
if [ -r /proc/cpuinfo ]; then
  grep -m 1 -E '^(model name|Hardware|Processor|cpu model)' /proc/cpuinfo || true
  printf 'LOGICAL_CPUS: '; (grep -c '^processor' /proc/cpuinfo || echo 0)
fi
printf '\nTOOLS\n'
for cmd in python3 node git chromium; do
  if command -v "$cmd" >/dev/null 2>&1; then printf '%s: AVAILABLE\n' "$cmd"; else printf '%s: NOT_FOUND\n' "$cmd"; fi
done
printf '\nRESULT: DEVICE_PROFILE_ONLY, NO PERFORMANCE PASS CLAIM\n'
