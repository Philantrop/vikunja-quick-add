#!/bin/bash
set -e

# Build script for Vikunja Quick Add extension
# This script creates a distributable ZIP file of the extension

VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
BUILD_DIR="dist"
OUTPUT_FILE="vikunja-quick-add-v${VERSION}.zip"

echo "Building Vikunja Quick Add v${VERSION}..."

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

# Create build directory
echo "Creating build directory..."
mkdir -p "$BUILD_DIR"

# Copy extension files
echo "Copying extension files..."
cp -r src "$BUILD_DIR/"
cp -r public "$BUILD_DIR/"
cp -r assets "$BUILD_DIR/"
cp manifest.json "$BUILD_DIR/"
cp LICENSE "$BUILD_DIR/"

# Create ZIP file
echo "Creating ZIP archive..."
cd "$BUILD_DIR"
zip -r "../${OUTPUT_FILE}" .
cd ..

echo "✓ Build complete: ${OUTPUT_FILE}"
echo "  Size: $(du -h "${OUTPUT_FILE}" | cut -f1)"

# Verify ZIP contents
echo ""
echo "ZIP contents:"
unzip -l "${OUTPUT_FILE}" | head -20
