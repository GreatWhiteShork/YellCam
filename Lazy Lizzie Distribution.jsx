/**
 * Distribute Layers
 * Distributes selected layers horizontally, vertically, or in a grid.
 * Includes options for Canvas distribution, Anchor Point spacing, and Alpha/Visible Bounds spacing.
 */

(function(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Distribute Layers", undefined, {resizeable: true});
        
        if (win != null) {
            win.orientation = "column";
            win.alignChildren = ["fill", "top"];
            win.spacing = 10;
            win.margins = 12;

            // Action Buttons (Now incorporating the Logo to save space)
            var grpActions = win.add("group");
            grpActions.orientation = "row";
            grpActions.alignChildren = ["left", "center"];
            grpActions.alignment = ["fill", "top"];

            var logo = grpActions.add("group", undefined, "");
            logo.preferredSize = [40, 40];
            logo.helpTip = "Liz Logo";
            logo.onDraw = function() {
                var g = this.graphics;
                var cDark = g.newBrush(g.BrushType.SOLID_COLOR, [0.45, 0.25, 0.15, 1]);
                var cMid = g.newBrush(g.BrushType.SOLID_COLOR, [0.65, 0.35, 0.20, 1]);
                var cTan = g.newBrush(g.BrushType.SOLID_COLOR, [0.85, 0.78, 0.60, 1]);
                var cBlack = g.newBrush(g.BrushType.SOLID_COLOR, [0.15, 0.10, 0.05, 1]);
                var cYellow = g.newBrush(g.BrushType.SOLID_COLOR, [0.95, 0.65, 0.0, 1]);

                function poly(pts, brush) {
                    g.newPath();
                    g.moveTo(pts[0][0], pts[0][1]);
                    for(var i=1; i<pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
                    g.closePath();
                    g.fillPath(brush);
                }

                // Left & Right Ear Outer
                poly([[13,12], [3,3], [9,24]], cDark);
                poly([[27,12], [37,3], [31,24]], cDark);
                
                // Left & Right Ear Inner
                poly([[13,14], [6,7], [10,21]], cTan);
                poly([[27,14], [34,7], [30,21]], cTan);

                // Base Face
                poly([[13,12], [27,12], [31,24], [25,36], [20,38], [15,36], [9,24]], cMid);

                // Left & Right Cheeks
                poly([[9,24], [16,24], [16,33], [15,36]], cTan);
                poly([[31,24], [24,24], [24,33], [25,36]], cTan);

                // Left & Right Eyebrow
                poly([[9,18], [15,16], [16,19]], cTan);
                poly([[31,18], [25,16], [24,19]], cTan);

                // Left Eye
                poly([[12,21], [17,21], [17,23], [12,23]], cBlack);
                poly([[13,21.5], [16,21.5], [16,22.5], [13,22.5]], cYellow);
                poly([[14.5,21.5], [16,21.5], [16,22.5], [14.5,22.5]], cBlack);

                // Right Eye
                poly([[23,21], [28,21], [28,23], [23,23]], cBlack);
                poly([[24,21.5], [27,21.5], [27,22.5], [24,22.5]], cYellow);
                poly([[24,21.5], [25.5,21.5], [25.5,22.5], [24,22.5]], cBlack);

                // Nose & Mouth
                poly([[17,32], [23,32], [21,35], [19,35]], cBlack);
                var pen = g.newPen(g.PenType.SOLID_COLOR, [0.15, 0.10, 0.05, 1], 1);
                g.newPath(); g.moveTo(20, 35); g.lineTo(20, 37); g.strokePath(pen);
                g.newPath(); g.moveTo(17, 37); g.lineTo(23, 37); g.strokePath(pen);
            };

            // Spacer to separate the logo from the distribution buttons
            var logoSpacer = grpActions.add("group");
            logoSpacer.preferredSize = [15, 10];
            
            var btnHoriz = grpActions.add("button", undefined, "");
            btnHoriz.preferredSize = [60, 30];
            btnHoriz.helpTip = "Distribute Horizontally";
            btnHoriz.onDraw = function() {
                var g = this.graphics;
                g.drawOSControl();
                var brush = g.newBrush(g.BrushType.SOLID_COLOR, [0.85, 0.85, 0.85, 1]);
                var size = 6, gap = 4;
                var startX = (this.size[0] - (size * 3 + gap * 2)) / 2;
                var startY = (this.size[1] - size) / 2;
                g.newPath();
                g.rectPath(startX, startY, size, size);
                g.rectPath(startX + size + gap, startY, size, size);
                g.rectPath(startX + (size + gap) * 2, startY, size, size);
                g.fillPath(brush);
            };

            var btnVert = grpActions.add("button", undefined, "");
            btnVert.preferredSize = [60, 30];
            btnVert.helpTip = "Distribute Vertically";
            btnVert.onDraw = function() {
                var g = this.graphics;
                g.drawOSControl();
                var brush = g.newBrush(g.BrushType.SOLID_COLOR, [0.85, 0.85, 0.85, 1]);
                var size = 6, gap = 4;
                var startX = (this.size[0] - size) / 2;
                var startY = (this.size[1] - (size * 3 + gap * 2)) / 2;
                g.newPath();
                g.rectPath(startX, startY, size, size);
                g.rectPath(startX, startY + size + gap, size, size);
                g.rectPath(startX, startY + (size + gap) * 2, size, size);
                g.fillPath(brush);
            };

            var btnGrid = grpActions.add("button", undefined, "");
            btnGrid.preferredSize = [60, 30];
            btnGrid.helpTip = "Distribute in a Staggered Grid";
            btnGrid.onDraw = function() {
                var g = this.graphics;
                g.drawOSControl();
                var brush = g.newBrush(g.BrushType.SOLID_COLOR, [0.85, 0.85, 0.85, 1]);
                var size = 4, gap = 2;
                var w3 = size * 3 + gap * 2;
                var h3 = size * 3 + gap * 2;
                var startX = (this.size[0] - w3) / 2;
                var startY = (this.size[1] - h3) / 2;
                
                g.newPath();
                // Top Row
                g.rectPath(startX, startY, size, size);
                g.rectPath(startX + size + gap, startY, size, size);
                g.rectPath(startX + (size + gap) * 2, startY, size, size);
                // Middle Row 
                var offset = (size + gap) / 2;
                g.rectPath(startX + offset, startY + size + gap, size, size);
                g.rectPath(startX + offset + size + gap, startY + size + gap, size, size);
                // Bottom Row
                g.rectPath(startX, startY + (size + gap) * 2, size, size);
                g.rectPath(startX + size + gap, startY + (size + gap) * 2, size, size);
                g.rectPath(startX + (size + gap) * 2, startY + (size + gap) * 2, size, size);
                g.fillPath(brush);
            };

            var btnCircle = grpActions.add("button", undefined, "");
            btnCircle.preferredSize = [60, 30];
            btnCircle.helpTip = "Distribute in a Circle/Oval\nNote: Forces the use of Anchor Point spacing method.";
            btnCircle.onDraw = function() {
                var g = this.graphics;
                g.drawOSControl();
                var brush = g.newBrush(g.BrushType.SOLID_COLOR, [0.85, 0.85, 0.85, 1]);
                var size = 4, r = 8;
                var cx = this.size[0] / 2;
                var cy = this.size[1] / 2;
                
                g.newPath();
                for (var i = 0; i < 8; i++) {
                    var angle = i * (Math.PI / 4);
                    var px = cx + Math.cos(angle) * r - (size/2);
                    var py = cy + Math.sin(angle) * r - (size/2);
                    g.rectPath(px, py, size, size);
                }
                g.fillPath(brush);
            };

            // -- PANELS ROW --
            var pnlContainer = win.add("group");
            pnlContainer.orientation = "row";
            pnlContainer.alignChildren = ["left", "fill"];
            pnlContainer.spacing = 10;
            pnlContainer.alignment = ["fill", "top"];

            // Helper to draw pressed-in background
            function drawButtonBg(btn, g) {
                if (btn.isActiveMode) {
                    var bgBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.15, 0.15, 0.15, 1]);
                    g.newPath(); g.rectPath(0, 0, btn.size[0], btn.size[1]); g.fillPath(bgBrush);
                    var strokePen = g.newPen(g.PenType.SOLID_COLOR, [0.05, 0.05, 0.05, 1], 1);
                    g.strokePath(strokePen);
                } else {
                    g.drawOSControl();
                }
            }

            // -- METHOD PANEL --
            var pnlMethod = pnlContainer.add("panel", undefined, "Method");
            pnlMethod.orientation = "row";
            pnlMethod.alignChildren = ["center", "center"];
            pnlMethod.spacing = 4;
            pnlMethod.margins = [10, 15, 10, 10];

            var btnAnchor = pnlMethod.add("button", undefined, "");
            btnAnchor.preferredSize = [26, 26];
            btnAnchor.helpTip = "Anchor Points\nUses exact anchor point positions for spacing.";
            btnAnchor.modeId = "anchor";
            btnAnchor.isActiveMode = true; // Default
            btnAnchor.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1]);
                var iconPen = g.newPen(g.PenType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1], 1.5);
                g.newPath(); g.ellipsePath(cx-2, cy-2, 4, 4); g.fillPath(iconBrush);
                g.newPath(); g.moveTo(cx, cy-6.4); g.lineTo(cx, cy+6.4); g.moveTo(cx-6.4, cy); g.lineTo(cx+6.4, cy); g.strokePath(iconPen);
            };

            var btnBounds = pnlMethod.add("button", undefined, "");
            btnBounds.preferredSize = [26, 26];
            btnBounds.helpTip = "Layer Bounds\nUses visible shape/text boundaries.";
            btnBounds.modeId = "bounds";
            btnBounds.isActiveMode = false;
            btnBounds.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1]);
                var iconPen = g.newPen(g.PenType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1], 1.5);
                g.newPath(); g.rectPath(cx-6.4, cy-6.4, 12.8, 12.8); g.strokePath(iconPen);
                g.newPath(); g.rectPath(cx-4, cy-4, 8, 8); g.fillPath(iconBrush);
            };

            var btnMasks = pnlMethod.add("button", undefined, "");
            btnMasks.preferredSize = [26, 26];
            btnMasks.helpTip = "Masked Bounds\nBounds accurately trimmed by active layer masks.";
            btnMasks.modeId = "masks";
            btnMasks.isActiveMode = false;
            btnMasks.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var color = this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1];
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, color);
                var thickPen = g.newPen(g.PenType.SOLID_COLOR, color, 1.5);
                var thinPen = g.newPen(g.PenType.SOLID_COLOR, color, 1);
                
                // Thinner outer square
                g.newPath(); g.rectPath(cx-6.4, cy-6.4, 12.8, 12.8); g.strokePath(thinPen);
                
                // Inner triangle stroke
                g.newPath(); 
                g.moveTo(cx, cy-4); 
                g.lineTo(cx+4, cy+3.2); 
                g.lineTo(cx-4, cy+3.2); 
                g.closePath(); 
                g.strokePath(thickPen);
                
                // Mask handles
                var hs = 1.2;
                g.newPath();
                g.rectPath(cx - hs, cy - 4 - hs, hs*2, hs*2); // Top
                g.rectPath(cx + 4 - hs, cy + 3.2 - hs, hs*2, hs*2); // Bottom Right
                g.rectPath(cx - 4 - hs, cy + 3.2 - hs, hs*2, hs*2); // Bottom Left
                g.fillPath(iconBrush);
            };

            var btnAlpha = pnlMethod.add("button", undefined, "");
            btnAlpha.preferredSize = [26, 26];
            btnAlpha.helpTip = "True Alpha Scan\n(Slow) Evaluates actual pixel transparency.";
            btnAlpha.modeId = "alpha";
            btnAlpha.isActiveMode = false;
            btnAlpha.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var faintPen = g.newPen(g.PenType.SOLID_COLOR, this.isActiveMode ? [1,1,1,0.3] : [0.7,0.7,0.7,0.3], 1);
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1]);
                g.newPath(); g.rectPath(cx-6.4, cy-6.4, 12.8, 12.8); g.strokePath(faintPen);
                g.newPath(); g.ellipsePath(cx-3.2, cy-4, 6.4, 6.4); g.ellipsePath(cx-0.8, cy-1.6, 4.8, 4.8); g.fillPath(iconBrush);
            };

            var btnBake = pnlMethod.add("button", undefined, "");
            btnBake.preferredSize = [26, 26];
            btnBake.helpTip = "Bake Alpha Bounds\n(Slow) Bakes true pixels into a mask and centers the anchor point.";
            btnBake.modeId = "bakeAlpha";
            btnBake.isActiveMode = false;
            btnBake.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var alphaBrush = g.newBrush(g.BrushType.SOLID_COLOR, this.isActiveMode ? [1,1,1,0.5] : [0.7,0.7,0.7,0.5]);
                var iconPen = g.newPen(g.PenType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1], 1.5);
                g.newPath(); g.ellipsePath(cx-3.2, cy-4, 6.4, 6.4); g.ellipsePath(cx-0.8, cy-1.6, 4.8, 4.8); g.fillPath(alphaBrush);
                g.newPath(); g.rectPath(cx-3.2, cy-4, 7.2, 7.2); g.strokePath(iconPen);
                g.newPath(); g.moveTo(cx, cy-2.4); g.lineTo(cx, cy+2.4); g.moveTo(cx-2.4, cy); g.lineTo(cx+2.4, cy); g.strokePath(iconPen);
            };

            var modeBtns = [btnAnchor, btnBounds, btnMasks, btnAlpha, btnBake];
            var activeMode = "anchor";

            function setMode(modeId) {
                activeMode = modeId;
                for (var i = 0; i < modeBtns.length; i++) {
                    modeBtns[i].isActiveMode = (modeBtns[i].modeId === activeMode);
                    // Flash hide/show forces ScriptUI to immediately repaint the custom onDraw background
                    modeBtns[i].hide();
                    modeBtns[i].show();
                }
            }

            for (var i = 0; i < modeBtns.length; i++) {
                modeBtns[i].onClick = function() { setMode(this.modeId); };
            }

            // -- SPACING PANEL --
            var pnlSpacing = pnlContainer.add("panel", undefined, "Spacing");
            pnlSpacing.orientation = "row";
            pnlSpacing.alignChildren = ["left", "center"];
            pnlSpacing.spacing = 6;
            pnlSpacing.margins = [10, 15, 10, 10];
            
            // Canvas Spacing Toggle
            var btnCompSpacing = pnlSpacing.add("button", undefined, "");
            btnCompSpacing.preferredSize = [26, 26];
            btnCompSpacing.helpTip = "Canvas Spacing\nDistribute evenly across Composition Size.";
            btnCompSpacing.modeId = "comp";
            btnCompSpacing.isActiveMode = true;
            btnCompSpacing.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var color = this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1];
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, color);
                var iconPen = g.newPen(g.PenType.SOLID_COLOR, color, 1.5);
                
                // Outer square
                g.newPath(); g.rectPath(cx-7, cy-7, 14, 14); g.strokePath(iconPen);
                
                // Center dot
                g.newPath(); g.ellipsePath(cx-1, cy-1, 2, 2); g.fillPath(iconBrush);
                
                // Arrows pointing outward
                g.newPath();
                // Up
                g.moveTo(cx, cy-2.4); g.lineTo(cx, cy-5.6);
                g.moveTo(cx-1.6, cy-4); g.lineTo(cx, cy-5.6); g.lineTo(cx+1.6, cy-4);
                // Down
                g.moveTo(cx, cy+2.4); g.lineTo(cx, cy+5.6);
                g.moveTo(cx-1.6, cy+4); g.lineTo(cx, cy+5.6); g.lineTo(cx+1.6, cy+4);
                // Left
                g.moveTo(cx-2.4, cy); g.lineTo(cx-5.6, cy);
                g.moveTo(cx-4, cy-1.6); g.lineTo(cx-5.6, cy); g.lineTo(cx-4, cy+1.6);
                // Right
                g.moveTo(cx+2.4, cy); g.lineTo(cx+5.6, cy);
                g.moveTo(cx+4, cy-1.6); g.lineTo(cx+5.6, cy); g.lineTo(cx+4, cy+1.6);
                g.strokePath(iconPen);
            };

            // Custom Spacing Toggle
            var btnCustomSpacing = pnlSpacing.add("button", undefined, "");
            btnCustomSpacing.preferredSize = [26, 26];
            btnCustomSpacing.helpTip = "Custom Spacing\nUse specific X and Y values.";
            btnCustomSpacing.modeId = "custom";
            btnCustomSpacing.isActiveMode = false;
            btnCustomSpacing.onDraw = function() {
                var g = this.graphics; drawButtonBg(this, g);
                var cx = this.size[0]/2, cy = this.size[1]/2;
                var iconBrush = g.newBrush(g.BrushType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1]);
                var iconPen = g.newPen(g.PenType.SOLID_COLOR, this.isActiveMode ? [1,1,1,1] : [0.7,0.7,0.7,1], 1.5);
                g.newPath(); g.rectPath(cx-9.6, cy-3.2, 4.8, 6.4); g.rectPath(cx+4.8, cy-3.2, 4.8, 6.4); g.fillPath(iconBrush);
                g.newPath(); g.moveTo(cx-3.2, cy); g.lineTo(cx+3.2, cy); g.strokePath(iconPen);
                g.newPath(); g.moveTo(cx-3.2, cy-2.4); g.lineTo(cx-3.2, cy+2.4); g.strokePath(iconPen);
                g.newPath(); g.moveTo(cx+3.2, cy-2.4); g.lineTo(cx+3.2, cy+2.4); g.strokePath(iconPen);
            };

            var activeSpacingMode = "comp";

            pnlSpacing.add("statictext", undefined, "X:");
            var numX = pnlSpacing.add("edittext", undefined, "100");
            numX.characters = 4;
            
            pnlSpacing.add("statictext", undefined, "Y:");
            var numY = pnlSpacing.add("edittext", undefined, "100");
            numY.characters = 4;

            function setSpacingMode(modeId) {
                activeSpacingMode = modeId;
                btnCompSpacing.isActiveMode = (modeId === "comp");
                btnCustomSpacing.isActiveMode = (modeId === "custom");
                btnCompSpacing.hide(); btnCompSpacing.show();
                btnCustomSpacing.hide(); btnCustomSpacing.show();
                var isCustom = (modeId === "custom");
                numX.enabled = isCustom;
                numY.enabled = isCustom;
            }

            btnCompSpacing.onClick = function() { setSpacingMode("comp"); };
            btnCustomSpacing.onClick = function() { setSpacingMode("custom"); };
            setSpacingMode(activeSpacingMode); // Initialize

            // Make panel responsive when resizing
            win.onResizing = win.onResize = function() {
                this.layout.resize();
            };

            // Utility: Get bounds using sourceRectAtTime for visible alpha/pixels (Fast method)
            function getLayerBounds(layer, time) {
                try {
                    // Get pre-transform bounds
                    var rect = layer.sourceRectAtTime(time, false);
                    var scale = layer.scale.value;
                    var sX = scale[0] / 100.0;
                    var sY = scale[1] / 100.0;
                    var ap = layer.anchorPoint.value;

                    // Calculate edge offsets relative to the anchor point (scaled)
                    var leftEdge = (rect.left - ap[0]) * sX;
                    var topEdge = (rect.top - ap[1]) * sY;
                    
                    var realWidth = rect.width * Math.abs(sX);
                    var realHeight = rect.height * Math.abs(sY);
                    
                    var centerX = leftEdge + (realWidth / 2);
                    var centerY = topEdge + (realHeight / 2);

                    return {
                        leftOffset: leftEdge,
                        topOffset: topEdge,
                        width: realWidth,
                        height: realHeight,
                        centerOffsetX: centerX,
                        centerOffsetY: centerY
                    };
                } catch(e) {
                    // Fallback for non-visual layers (audio, nulls, cameras)
                    return { leftOffset: 0, topOffset: 0, width: 0, height: 0, centerOffsetX: 0, centerOffsetY: 0 };
                }
            }

            // Utility: Get bounding box of all active masks (including bezier curves & feathering)
            function getMasksBoundingBox(layer, time) {
                var masksProp = layer.property("ADBE Mask Parade");
                if (!masksProp || masksProp.numProperties === 0) return null;
                
                var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                var hasPositiveMask = false;

                for (var i = 1; i <= masksProp.numProperties; i++) {
                    var mask = masksProp.property(i);
                    var mode = mask.maskMode;
                    
                    // We only want to restrict the outer bounds if there are masks that define an outer edge
                    if (mode === MaskMode.ADD || mode === MaskMode.INTERSECT || mode === MaskMode.LIGHTEN) {
                        hasPositiveMask = true;
                    }
                    
                    if (mode !== MaskMode.NONE) {
                        var maskShape = mask.property("ADBE Mask Shape").valueAtTime(time, false);
                        var feather = [0, 0];
                        if (mask.property("ADBE Mask Feather")) {
                            feather = mask.property("ADBE Mask Feather").valueAtTime(time, false);
                        }
                        
                        var verts = maskShape.vertices;
                        var inT = maskShape.inTangents;
                        var outT = maskShape.outTangents;
                        
                        for (var v = 0; v < verts.length; v++) {
                            var pt = verts[v];
                            // Include Bezier Tangents
                            var ptIn = [pt[0] + inT[v][0], pt[1] + inT[v][1]];
                            var ptOut = [pt[0] + outT[v][0], pt[1] + outT[v][1]];
                            
                            var pts = [pt, ptIn, ptOut];
                            for (var p = 0; p < pts.length; p++) {
                                // Account for mask feathering spreading the bounds outward
                                if (pts[p][0] - Math.abs(feather[0]) < minX) minX = pts[p][0] - Math.abs(feather[0]);
                                if (pts[p][0] + Math.abs(feather[0]) > maxX) maxX = pts[p][0] + Math.abs(feather[0]);
                                if (pts[p][1] - Math.abs(feather[1]) < minY) minY = pts[p][1] - Math.abs(feather[1]);
                                if (pts[p][1] + Math.abs(feather[1]) > maxY) maxY = pts[p][1] + Math.abs(feather[1]);
                            }
                        }
                    }
                }

                if (!hasPositiveMask || minX === Infinity) return null;
                return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
            }

            // Utility: Intersect layer bounds with mask extents
            function getMaskedBounds(layer, time) {
                try {
                    if (!layer.hasVideo) return getLayerBounds(layer, time);

                    var rectBase = layer.sourceRectAtTime(time, false); // base layer only
                    var maskBounds = getMasksBoundingBox(layer, time);

                    var lLeft, lTop, lRight, lBottom;

                    if (maskBounds !== null) {
                        // Calculate the precise intersection so masks cannot arbitrarily expand the boundary
                        lLeft = Math.max(rectBase.left, maskBounds.left);
                        lTop = Math.max(rectBase.top, maskBounds.top);
                        lRight = Math.min(rectBase.left + rectBase.width, maskBounds.left + maskBounds.width);
                        lBottom = Math.min(rectBase.top + rectBase.height, maskBounds.top + maskBounds.height);
                    } else {
                        lLeft = rectBase.left;
                        lTop = rectBase.top;
                        lRight = rectBase.left + rectBase.width;
                        lBottom = rectBase.top + rectBase.height;
                    }
                    
                    var rWidth = Math.max(0, lRight - lLeft);
                    var rHeight = Math.max(0, lBottom - lTop);

                    var scale = layer.scale.value;
                    var sX = scale[0] / 100.0;
                    var sY = scale[1] / 100.0;
                    var ap = layer.anchorPoint.value;

                    var leftEdge = (lLeft - ap[0]) * sX;
                    var topEdge = (lTop - ap[1]) * sY;
                    
                    var realWidth = rWidth * Math.abs(sX);
                    var realHeight = rHeight * Math.abs(sY);
                    
                    var centerX = leftEdge + (realWidth / 2);
                    var centerY = topEdge + (realHeight / 2);

                    return {
                        leftOffset: leftEdge,
                        topOffset: topEdge,
                        width: realWidth,
                        height: realHeight,
                        centerOffsetX: centerX,
                        centerOffsetY: centerY
                    };
                } catch(e) {
                    return getLayerBounds(layer, time);
                }
            }

            // Utility: Use an expression to sample image alpha dynamically (Slow but precise method)
            function getTrueAlphaBounds(layer, time) {
                // Safely filter out non-visual layers (audio, cameras, lights, nulls)
                if (layer instanceof TextLayer || layer instanceof ShapeLayer || layer.nullLayer || layer instanceof CameraLayer || layer instanceof LightLayer || !layer.source || !layer.hasVideo) {
                    return getLayerBounds(layer, time);
                }
                
                var prop = null;
                var wasEnabled = layer.enabled;
                
                try {
                    if (!wasEnabled) layer.enabled = true; // Briefly enable to allow sampleImage evaluation
                    
                    // Add temporary Color Control to run the sampleImage calculation
                    prop = layer.property("Effects").addProperty("ADBE Color Control");
                    prop.name = "Temp_AlphaBounds_Scanner";
                    
                    // This expression calculates bounds on a 100x100 grid mapping the whole layer
                    var expr = "var w = width;\n" +
                               "var h = height;\n" +
                               "var stepX = Math.max(1, Math.floor(w / 100));\n" +
                               "var stepY = Math.max(1, Math.floor(h / 100));\n" +
                               "var minX = w, minY = h, maxX = 0, maxY = 0;\n" +
                               "var found = false;\n" +
                               "for (var y = 0; y <= h; y += stepY) {\n" +
                               "    for (var x = 0; x <= w; x += stepX) {\n" +
                               "        if (sampleImage([x, y], [stepX/2, stepY/2], true, time)[3] > 0.05) {\n" +
                               "            if (x < minX) minX = x;\n" +
                               "            if (x > maxX) maxX = x;\n" +
                               "            if (y < minY) minY = y;\n" +
                               "            if (y > maxY) maxY = y;\n" +
                               "            found = true;\n" +
                               "        }\n" +
                               "    }\n" +
                               "}\n" +
                               "found ? [minX/w, minY/h, maxX/w, maxY/h] : [0,0,0,0];";
                               
                    prop.property("Color").expression = expr;
                    var colorVal = prop.property("Color").valueAtTime(time, false);
                    
                    try { prop.remove(); } catch(e){} // Clean up immediately safely
                    prop = null; // Clear reference immediately so catch block doesn't trip on invalidated object
                    
                    if (!wasEnabled) layer.enabled = false;
                    
                    var sourceW = layer.source.width;
                    var sourceH = layer.source.height;
                    
                    var minX = colorVal[0] * sourceW;
                    var minY = colorVal[1] * sourceH;
                    var maxX = colorVal[2] * sourceW;
                    var maxY = colorVal[3] * sourceH;
                    
                    // Fallback if layer is completely transparent
                    if (minX === 0 && maxX === 0 && minY === 0 && maxY === 0) {
                        return getLayerBounds(layer, time);
                    }
                    
                    var scale = layer.scale.value;
                    var sX = scale[0] / 100.0;
                    var sY = scale[1] / 100.0;
                    var ap = layer.anchorPoint.value;
                    
                    var leftEdge = (minX - ap[0]) * sX;
                    var topEdge = (minY - ap[1]) * sY;
                    
                    var realWidth = (maxX - minX) * Math.abs(sX);
                    var realHeight = (maxY - minY) * Math.abs(sY);
                    
                    var centerX = leftEdge + (realWidth / 2);
                    var centerY = topEdge + (realHeight / 2);
                    
                    return {
                        leftOffset: leftEdge,
                        topOffset: topEdge,
                        width: realWidth,
                        height: realHeight,
                        centerOffsetX: centerX,
                        centerOffsetY: centerY
                    };
                    
                } catch(err) {
                    // We use a blind catch here to ensure invalidated objects never trigger ReferenceErrors
                    try { prop.remove(); } catch(e){}
                    if (!wasEnabled) layer.enabled = false;
                    throw err;
                }
            }

            // Utility: Bake true alpha to a bounding mask and center anchor point
            function bakeAlphaToMask(layer, time) {
                if (!layer.hasVideo) return;
                
                var minX, minY, maxX, maxY;
                
                // For vectors/shapes without standard sampleImage support, use standard bounds calculation
                if (layer instanceof TextLayer || layer instanceof ShapeLayer || layer.nullLayer || !layer.source) {
                    var rect = layer.sourceRectAtTime(time, false);
                    minX = rect.left;
                    minY = rect.top;
                    maxX = rect.left + rect.width;
                    maxY = rect.top + rect.height;
                } else {
                    var wasEnabled = layer.enabled;
                    var prop = null;
                    try {
                        if (!wasEnabled) layer.enabled = true;
                        prop = layer.property("Effects").addProperty("ADBE Color Control");
                        prop.name = "Temp_AlphaBounds_Scanner";
                        
                        var expr = "var w = width;\n" +
                                   "var h = height;\n" +
                                   "var stepX = Math.max(1, Math.floor(w / 100));\n" +
                                   "var stepY = Math.max(1, Math.floor(h / 100));\n" +
                                   "var minX = w, minY = h, maxX = 0, maxY = 0;\n" +
                                   "var found = false;\n" +
                                   "for (var y = 0; y <= h; y += stepY) {\n" +
                                   "    for (var x = 0; x <= w; x += stepX) {\n" +
                                   "        if (sampleImage([x, y], [stepX/2, stepY/2], true, time)[3] > 0.05) {\n" +
                                   "            if (x < minX) minX = x;\n" +
                                   "            if (x > maxX) maxX = x;\n" +
                                   "            if (y < minY) minY = y;\n" +
                                   "            if (y > maxY) maxY = y;\n" +
                                   "            found = true;\n" +
                                   "        }\n" +
                                   "    }\n" +
                                   "}\n" +
                                   "found ? [minX/w, minY/h, maxX/w, maxY/h] : [0,0,0,0];";
                                   
                        prop.property("Color").expression = expr;
                        var colorVal = prop.property("Color").valueAtTime(time, false);
                        
                        try { prop.remove(); } catch(e){} 
                        prop = null; 
                        
                        if (!wasEnabled) layer.enabled = false;
                        
                        var sourceW = layer.source.width;
                        var sourceH = layer.source.height;
                        
                        minX = colorVal[0] * sourceW;
                        minY = colorVal[1] * sourceH;
                        maxX = colorVal[2] * sourceW;
                        maxY = colorVal[3] * sourceH;
                        
                        // Abort if completely transparent
                        if (minX === 0 && maxX === 0 && minY === 0 && maxY === 0) return;
                        
                    } catch(err) {
                        try { prop.remove(); } catch(e){}
                        if (!wasEnabled) layer.enabled = false;
                        throw err;
                    }
                }
                
                // Add 2 pixels of padding to protect faint anti-aliasing edges
                var padding = 2;
                minX -= padding;
                minY -= padding;
                maxX += padding;
                maxY += padding;
                
                var oldAP = layer.anchorPoint.value;
                var oldPos = layer.position.value;
                
                // Calculate exact center of the new mask bounds
                var newAP = [minX + (maxX - minX)/2, minY + (maxY - minY)/2, oldAP[2] || 0];
                
                var scale = layer.scale.value;
                var sX = scale[0] / 100.0;
                var sY = scale[1] / 100.0;
                
                var dx = (newAP[0] - oldAP[0]) * sX;
                var dy = (newAP[1] - oldAP[1]) * sY;
                
                var rad = layer.rotation ? (layer.rotation.value * (Math.PI / 180)) : 0;
                var rotX = dx * Math.cos(rad) - dy * Math.sin(rad);
                var rotY = dx * Math.sin(rad) + dy * Math.cos(rad);
                
                // Center anchor point without visually shifting the layer position
                layer.anchorPoint.setValue(newAP);
                layer.position.setValue([oldPos[0] + rotX, oldPos[1] + rotY, oldPos[2]]);
                
                // Create Rectangular Mask for AVLayers (Text/Shape handle their own bounds tightly)
                if (layer instanceof AVLayer && !(layer instanceof TextLayer) && !(layer instanceof ShapeLayer)) {
                    var maskGroup = layer.property("ADBE Mask Parade");
                    var newMask = maskGroup.addProperty("ADBE Mask Atom");
                    newMask.name = "Baked Alpha Bounds";
                    newMask.maskMode = MaskMode.ADD;
                    
                    var maskShape = newMask.property("ADBE Mask Shape");
                    var shape = new Shape();
                    shape.vertices = [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
                    shape.closed = true;
                    maskShape.setValue(shape);
                }
            }

            // Progress Window Handler
            function getBoundsArray(layers, time, scanMode) {
                var N = layers.length;
                var bounds = [];
                
                var progWin = new Window("palette", "Scanning Layers...", undefined);
                progWin.margins = 20;
                progWin.spacing = 15;
                
                var txt = progWin.add("statictext", undefined, "Scanning layer 1 of " + N + "...\n(Hold SHIFT to cancel)", {multiline: true});
                txt.preferredSize.width = 250;
                txt.preferredSize.height = 35;
                
                var pb = progWin.add("progressbar", [0,0,250,15], 0, N);
                
                var isCanceled = false;
                
                progWin.center();
                progWin.show();
                
                try {
                    for (var i = 0; i < N; i++) {
                        
                        // Keyboard handler: Reliably bypasses single-thread UI lockups (only works with modifier keys in AE)
                        if (ScriptUI.environment.keyboardState.shiftKey) {
                            isCanceled = true;
                        }

                        if (isCanceled) break;
                        
                        txt.text = "Scanning layer " + (i+1) + " of " + N + "...\n(Hold SHIFT to cancel)";
                        pb.value = i;
                        progWin.update();
                        
                        if (scanMode === "alpha") {
                            bounds.push(getTrueAlphaBounds(layers[i], time));
                        } else if (scanMode === "bakeAlpha") {
                            bakeAlphaToMask(layers[i], time);
                            bounds.push(getMaskedBounds(layers[i], time));
                        } else if (scanMode === "masks") {
                            bounds.push(getMaskedBounds(layers[i], time));
                        } else {
                            bounds.push(getLayerBounds(layers[i], time));
                        }
                    }
                } catch(e) {
                    var errorDetails = "Error on Line " + (e.line ? e.line : "Unknown") + ":\n" + e.toString();
                    alert("Scan Failed!\n\n" + errorDetails);
                    isCanceled = true;
                } finally {
                    progWin.close();
                }
                
                if (isCanceled) return null;
                return bounds;
            }

            // Get sorted selected layers
            function getSortedLayers(comp) {
                var sel = comp.selectedLayers.slice(0);
                if (sel.length < 1) {
                    alert("Please select at least one layer.");
                    return null;
                }
                // Sort by layer index (timeline order)
                sel.sort(function(a, b) { return a.index - b.index; });
                return sel;
            }

            // Button Event Handlers
            btnHoriz.onClick = function() {
                var comp = app.project.activeItem;
                if (!comp || !(comp instanceof CompItem)) return alert("Please select a composition.");
                var layers = getSortedLayers(comp);
                if (!layers || layers.length < 2) return alert("Select at least 2 layers to distribute.");

                app.beginUndoGroup("Distribute Horizontal");
                
                var N = layers.length;
                var gapX = parseFloat(numX.text) || 0;
                var isBoundsMode = (activeMode !== "anchor");
                
                var bounds = [];
                if (isBoundsMode) {
                    bounds = getBoundsArray(layers, comp.time, activeMode);
                    if (bounds === null) {
                        app.endUndoGroup();
                        return; // Halt if canceled
                    }
                }
                
                var firstY = layers[0].position.value[1]; // Pin to Y of first selected layer

                if (activeMode === "anchor") { 
                    if (activeSpacingMode === "comp") { // Canvas Size Even Spacing
                        var step = comp.width / (N + 1);
                        for (var i = 0; i < N; i++) {
                            var p = layers[i].position.value;
                            layers[i].position.setValue([step * (i + 1), firstY, p[2] || 0]);
                        }
                    } else { // Custom Gap
                        var totalW = (N - 1) * gapX;
                        var startX = (comp.width - totalW) / 2; // Centered in comp
                        for (var i = 0; i < N; i++) {
                            var p = layers[i].position.value;
                            layers[i].position.setValue([startX + (i * gapX), firstY, p[2] || 0]);
                        }
                    }
                } else if (isBoundsMode) { 
                    var totalW = 0;
                    for (var i = 0; i < N; i++) {
                        totalW += bounds[i].width;
                    }
                    
                    var currentX, currentGapX;

                    if (activeSpacingMode === "comp") { // Canvas Size Even Spacing
                        currentGapX = (comp.width - totalW) / (N + 1);
                        currentX = currentGapX; // Start with 1 gap of padding
                    } else { // Custom Gap
                        currentGapX = gapX;
                        var totalSpacedW = totalW + (N - 1) * currentGapX;
                        currentX = (comp.width - totalSpacedW) / 2; // Centered in comp
                    }

                    for (var i = 0; i < N; i++) {
                        var p = layers[i].position.value;
                        var posX = currentX - bounds[i].leftOffset;
                        layers[i].position.setValue([posX, firstY, p[2] || 0]);
                        currentX += bounds[i].width + currentGapX;
                    }
                }
                app.endUndoGroup();
            };

            btnVert.onClick = function() {
                var comp = app.project.activeItem;
                if (!comp || !(comp instanceof CompItem)) return alert("Please select a composition.");
                var layers = getSortedLayers(comp);
                if (!layers || layers.length < 2) return alert("Select at least 2 layers to distribute.");

                app.beginUndoGroup("Distribute Vertical");
                
                var N = layers.length;
                var gapY = parseFloat(numY.text) || 0;
                var isBoundsMode = (activeMode !== "anchor");
                
                var bounds = [];
                if (isBoundsMode) {
                    bounds = getBoundsArray(layers, comp.time, activeMode);
                    if (bounds === null) {
                        app.endUndoGroup();
                        return; // Halt if canceled
                    }
                }

                var firstX = layers[0].position.value[0]; // Pin to X of first selected layer

                if (activeMode === "anchor") { 
                    if (activeSpacingMode === "comp") { // Canvas Size Even Spacing
                        var step = comp.height / (N + 1);
                        for (var i = 0; i < N; i++) {
                            var p = layers[i].position.value;
                            layers[i].position.setValue([firstX, step * (i + 1), p[2] || 0]);
                        }
                    } else { // Custom Gap
                        var totalH = (N - 1) * gapY;
                        var startY = (comp.height - totalH) / 2; // Centered in comp
                        for (var i = 0; i < N; i++) {
                            var p = layers[i].position.value;
                            layers[i].position.setValue([firstX, startY + (i * gapY), p[2] || 0]);
                        }
                    }
                } else if (isBoundsMode) { 
                    var totalH = 0;
                    for (var i = 0; i < N; i++) {
                        totalH += bounds[i].height;
                    }
                    
                    var currentY, currentGapY;

                    if (activeSpacingMode === "comp") { // Canvas Size Even Spacing
                        currentGapY = (comp.height - totalH) / (N + 1);
                        currentY = currentGapY; // Start with 1 gap of padding
                    } else { // Custom Gap
                        currentGapY = gapY;
                        var totalSpacedH = totalH + (N - 1) * currentGapY;
                        currentY = (comp.height - totalSpacedH) / 2; // Centered in comp
                    }

                    for (var i = 0; i < N; i++) {
                        var p = layers[i].position.value;
                        var posY = currentY - bounds[i].topOffset;
                        layers[i].position.setValue([firstX, posY, p[2] || 0]);
                        currentY += bounds[i].height + currentGapY;
                    }
                }
                app.endUndoGroup();
            };

            btnGrid.onClick = function() {
                var comp = app.project.activeItem;
                if (!comp || !(comp instanceof CompItem)) return alert("Please select a composition.");
                var layers = getSortedLayers(comp);
                if (!layers) return;

                app.beginUndoGroup("Distribute Grid");
                
                var N = layers.length;
                var gapX = parseFloat(numX.text) || 0;
                var gapY = parseFloat(numY.text) || 0;
                var isBoundsMode = (activeMode !== "anchor");
                
                var bounds = [];
                if (isBoundsMode) {
                    bounds = getBoundsArray(layers, comp.time, activeMode);
                    if (bounds === null) {
                        app.endUndoGroup();
                        return; // Halt if canceled
                    }
                }

                // Calculate optimal rows based on Comp dimensions to form an appropriate grid shape
                var compAR = comp.width / comp.height;
                var rows = Math.max(1, Math.round(Math.sqrt(N / compAR)));
                
                // Distribute items evenly to create a staggered "honeycomb" look
                var rowCounts = [];
                var baseCount = Math.floor(N / rows);
                var rem = N % rows;
                for (var i = 0; i < rows; i++) rowCounts.push(baseCount);
                
                // Add remainders alternating from outside-in to create staggered effect
                for (var i = 0; i < rows; i += 2) { if (rem > 0) { rowCounts[i]++; rem--; } }
                for (var i = 1; i < rows; i += 2) { if (rem > 0) { rowCounts[i]++; rem--; } }

                var layerIndex = 0;

                if (activeMode === "anchor") { 
                    if (activeSpacingMode === "comp") { // Canvas Size Grid
                        var cellH = comp.height / rows;
                        for (var r = 0; r < rows; r++) {
                            var cols = rowCounts[r];
                            var cellW = comp.width / cols;
                            for (var c = 0; c < cols; c++) {
                                var p = layers[layerIndex].position.value;
                                layers[layerIndex].position.setValue([(c * cellW) + (cellW / 2), (r * cellH) + (cellH / 2), p[2] || 0]);
                                layerIndex++;
                            }
                        }
                    } else { // Custom Gaps Grid
                        var totalH = (rows - 1) * gapY;
                        var startY = (comp.height - totalH) / 2;
                        
                        for (var r = 0; r < rows; r++) {
                            var cols = rowCounts[r];
                            var totalW = (cols - 1) * gapX;
                            var startX = (comp.width - totalW) / 2;
                            
                            for (var c = 0; c < cols; c++) {
                                var p = layers[layerIndex].position.value;
                                layers[layerIndex].position.setValue([startX + (c * gapX), startY + (r * gapY), p[2] || 0]);
                                layerIndex++;
                            }
                        }
                    }
                } else if (isBoundsMode) { // Visible / Alpha / Mask Bounds Grid
                    var rowMaxH = [];
                    var rowSumW = [];
                    
                    // First pass: Find maximum dimensions of each unique staggered row
                    var tempIndex = 0;
                    try {
                        for (var r = 0; r < rows; r++) {
                            var cols = rowCounts[r];
                            var maxH = 0;
                            var sumW = 0;
                            for (var c = 0; c < cols; c++) {
                                var b = bounds[tempIndex];
                                if (b.height > maxH) maxH = b.height;
                                sumW += b.width;
                                tempIndex++;
                            }
                            rowMaxH.push(maxH);
                            rowSumW.push(sumW); // Store bare widths for dynamic gap calculation
                        }
                    } catch(err) {
                        alert("Grid alignment error (likely an empty layer was selected).");
                        app.endUndoGroup();
                        return;
                    }

                    // Calculate total grid height to center the block vertically
                    var sumAllH = 0;
                    for (var r = 0; r < rows; r++) sumAllH += rowMaxH[r];
                    
                    var currentTop, currentGapY;
                    if (activeSpacingMode === "comp") { // Canvas Size Vertically
                        currentGapY = (comp.height - sumAllH) / (rows + 1);
                        currentTop = currentGapY;
                    } else { // Custom Gap Vertically
                        currentGapY = gapY;
                        var totalGridH = sumAllH + (rows - 1) * currentGapY;
                        currentTop = (comp.height - totalGridH) / 2;
                    }

                    // Second pass: position elements row-by-row
                    for (var r = 0; r < rows; r++) {
                        var cols = rowCounts[r];
                        
                        var currentLeft, currentGapX;
                        if (activeSpacingMode === "comp") { // Canvas Size Horizontally
                            currentGapX = (comp.width - rowSumW[r]) / (cols + 1);
                            currentLeft = currentGapX;
                        } else { // Custom Gap Horizontally
                            currentGapX = gapX;
                            var rowTotalW = rowSumW[r] + (cols - 1) * currentGapX;
                            currentLeft = (comp.width - rowTotalW) / 2;
                        }
                        
                        for (var c = 0; c < cols; c++) {
                            var b = bounds[layerIndex];
                            var p = layers[layerIndex].position.value;

                            var targetCenterX = currentLeft + (b.width / 2);
                            var targetCenterY = currentTop + (rowMaxH[r] / 2); // Center items vertically within row

                            var posX = targetCenterX - b.centerOffsetX;
                            var posY = targetCenterY - b.centerOffsetY;

                            layers[layerIndex].position.setValue([posX, posY, p[2] || 0]);
                            
                            currentLeft += b.width + currentGapX; // Advance for the next item in the row
                            layerIndex++;
                        }
                        currentTop += rowMaxH[r] + currentGapY; // Advance downwards for the next row
                    }
                }
                app.endUndoGroup();
            };

            btnCircle.onClick = function() {
                // Force Anchor Point mode visually to make it obvious
                if (typeof setMode === "function") setMode("anchor");

                var comp = app.project.activeItem;
                if (!comp || !(comp instanceof CompItem)) return alert("Please select a composition.");
                var layers = getSortedLayers(comp);
                if (!layers || layers.length < 2) return alert("Select at least 2 layers to distribute.");

                app.beginUndoGroup("Distribute Circle");
                
                var N = layers.length;
                var gapX = parseFloat(numX.text) || 0;
                var gapY = parseFloat(numY.text) || 0;
                
                var centerX = comp.width / 2;
                var centerY = comp.height / 2;
                var radX, radY;

                if (activeSpacingMode === "comp") { // Canvas Size Radius (40% of smallest dimension)
                    var minDim = Math.min(comp.width, comp.height);
                    radX = minDim * 0.4;
                    radY = minDim * 0.4;
                } else { // Custom Radii
                    radX = gapX;
                    radY = gapY;
                }

                // Calculate even spacing along the perimeter of the ellipse/circle
                // Since exact arc length of an ellipse requires complex integrals, 
                // we use a polyline approximation which is extremely fast and accurate.
                var numSamples = 1000;
                var points = [];
                var startAngle = -Math.PI / 2; // Start at 12 o'clock

                for (var i = 0; i <= numSamples; i++) {
                    var t = startAngle + (i / numSamples) * (2 * Math.PI);
                    var pX = Math.cos(t) * radX;
                    var pY = Math.sin(t) * radY;
                    var pt = {x: pX, y: pY, dist: 0};

                    if (i > 0) {
                        var prevPt = points[i-1];
                        var dx = pX - prevPt.x;
                        var dy = pY - prevPt.y;
                        var d = Math.sqrt(dx*dx + dy*dy);
                        pt.dist = prevPt.dist + d;
                    }
                    points.push(pt);
                }

                var totalLength = points[points.length - 1].dist;
                var targetStep = totalLength / N;
                var sampleIndex = 0;

                for (var i = 0; i < N; i++) {
                    var targetD = i * targetStep;

                    // Advance through samples until we bracket the target distance
                    while (sampleIndex < points.length - 1 && points[sampleIndex + 1].dist < targetD) {
                        sampleIndex++;
                    }

                    var p0 = points[sampleIndex];
                    var finalX = p0.x;
                    var finalY = p0.y;

                    // Linear interpolation for exact placement between samples
                    if (sampleIndex < points.length - 1) {
                        var p1 = points[sampleIndex + 1];
                        var segmentLength = p1.dist - p0.dist;
                        if (segmentLength > 0) {
                            var tRatio = (targetD - p0.dist) / segmentLength;
                            finalX = p0.x + (p1.x - p0.x) * tRatio;
                            finalY = p0.y + (p1.y - p0.y) * tRatio;
                        }
                    }

                    var p = layers[i].position.value;
                    layers[i].position.setValue([centerX + finalX, centerY + finalY, p[2] || 0]);
                }
                app.endUndoGroup();
            };
        }
        return win;
    }

    var scriptPal = buildUI(thisObj);
    if (scriptPal != null) {
        if (scriptPal instanceof Window) {
            // Running from ExtendScript Toolkit or File > Scripts > Run Script File
            scriptPal.center();
            scriptPal.show();
        } else {
            // Running as a Dockable Panel
            scriptPal.layout.layout(true);
            scriptPal.layout.resize();
        }
    }
})(this);