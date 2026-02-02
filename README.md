# Preattentive Features in Data Visualization

An interactive explainer demonstrating how preattentive visual features work in human perception and why they matter for effective data visualization.

## Overview

This project is inspired by [Enrico Bertini's article](https://filwd.substack.com/p/teaching-data-visualization-with-f5e) on using focused, interactive examples to teach data visualization concepts.

The explainer uses the classic **visual search paradigm** from cognitive psychology to demonstrate how certain visual features can be detected instantly (preattentively), while combinations of features require slower, sequential scanning.

## Features

### 9 Visual Features to Test

**Preattentive Features (8):**
- **Color (Hue)** - Red circle among blue circles
- **Size** - Large circle among small circles
- **Orientation** - Tilted line among horizontal lines
- **Shape** - Square among circles
- **Intensity** - Dark circle among light circles
- **Enclosure** - Circled item among uncircled items
- **Length** - Long line among short lines
- **Curvature** - Curved line among straight lines

**Non-Preattentive Feature (1):**
- **Conjunction** - Red circle among red squares and blue circles (requires checking multiple features)

### Adjustable Parameters

- **Number of distractors:** 5-50 (default: 42)
- **Number of trials:** 5-30 (default: 10)
- **Display duration:** 100-500ms (default: 300ms)
  - Values < 500ms hide the display after the specified duration
  - 500ms means unlimited display time

### Trial Flow

1. Click "Start Test"
2. 3-second countdown (3... 2... 1...)
3. Display appears with target present or absent (50% probability)
4. Display disappears after the specified duration
5. Click "Present" or "Absent" button
6. Immediate feedback (✓ Correct or ✗ Wrong)
7. Next trial begins automatically
8. After all trials, see aggregate statistics (accuracy & average reaction time)

## Key Concepts

### Preattentive Processing

Preattentive features are processed by our visual system in **less than 250 milliseconds**, before conscious attention. This creates a "pop-out" effect where the target is immediately visible regardless of the number of distractors.

### Conjunction Search

When searching for a target defined by a **combination of features** (e.g., red AND circle), the visual system must examine each item sequentially. This makes conjunction searches much slower and more effortful, especially on "absent" trials where every item must be checked.

### Implications for Data Visualization

- **Use color** to highlight important data points or categories
- **Use size** to show magnitude or importance  
- **Use shape** to distinguish between different types of data
- **Avoid conjunctions** when you need quick pattern recognition
- **Not all preattentive features are equal** - Color and orientation are highly effective, while curvature and enclosure are weaker and more context-dependent

## Technical Details

### Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling (inspired by vpascual/explainer-zeroaxis)
- `main.js` - JavaScript logic for the visual search task

### Technologies

- Pure vanilla JavaScript (no frameworks)
- SVG for rendering visual elements
- CSS Grid and Flexbox for layout
- No external dependencies

### Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- SVG
- CSS Grid
- CSS Custom Properties (CSS Variables)

## Running Locally

1. Clone this repository
2. Open `index.html` in a web browser
3. No build process or server required!

```bash
git clone [your-repo-url]
cd [repo-name]
open index.html  # or just double-click the file
```

## Usage Tips

### For Educators

- Have students compare their performance on **Color** vs **Conjunction** to experience the difference firsthand
- Adjust the display duration to demonstrate how preattentive features work even at very short durations (100-200ms)
- Increase the number of distractors to show that preattentive features "pop out" regardless of set size

### For Researchers

- The trial-by-trial data (correct/incorrect, reaction time, target presence) can be extracted from the browser console by modifying the code
- Display duration can be used to force reliance on preattentive processing
- Different features can be compared to measure relative effectiveness

### Interesting Experiments to Try

1. **Color at 100ms vs 300ms** - Performance should be similar (preattentive)
2. **Conjunction at 100ms vs 300ms** - Performance degrades dramatically at shorter durations
3. **Color with 10 vs 50 distractors** - Reaction time stays relatively constant
4. **Conjunction with 10 vs 50 distractors** - Reaction time increases significantly

## Known Limitations

- Display duration timing may vary slightly across browsers and systems
- Very short durations (< 200ms) may be affected by monitor refresh rates
- Mobile touch interfaces may have slightly different timing characteristics
- The debug indicator showing actual target presence is visible for testing purposes

## Credits

- **Inspired by:** [Enrico Bertini's teaching approach](https://filwd.substack.com/p/teaching-data-visualization-with-f5e)
- **Visual search paradigm:** Based on classic cognitive psychology research on preattentive processing
- **Styling:** Inspired by [vpascual/explainer-zeroaxis](https://github.com/vpascual/explainer-zeroaxis)

## License

[Add your license here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## References

Key papers on preattentive processing:
- Treisman, A., & Gelade, G. (1980). "A feature-integration theory of attention"
- Healey, C. G. (1996). "Choosing effective colours for data visualization"
- Ware, C. (2012). "Information Visualization: Perception for Design"
